'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Fetches a paginated list of formations with their favorite status for the current user.
 * Accepts filters (search, category, level, etc.) and pagination parameters.
 *
 * @param {object} params - Object containing filters and pagination.
 * @param {string} [params.search] - Search term for formation title/description.
 * @param {string[]} [params.categorySlugs] - Array of category slugs to filter by.
 * @param {string} [params.niveau] - Level of the formation.
 * @param {string} [params.mode] - Mode of delivery (en_ligne, presentiel, hybride).
 * @param {boolean} [params.certificat] - Filter by certificate availability.
 * @param {number} [params.maxPrice] - Maximum price.
 * @param {number} [params.minRating] - Minimum rating.
 * @param {number} [params.limit=10] - Number of formations to return.
 * @param {number} [params.offset=0] - Offset for pagination.
 * @returns A result object with data or error.
 */
export async function getPaginatedFormationsAction(params: {
  search?: string;
  categorySlugs?: string[];
  niveau?: string;
  mode?: string;
  certificat?: boolean;
  maxPrice?: number;
  minRating?: number;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id || null;

  const {
    search,
    categorySlugs,
    niveau,
    mode,
    certificat,
    maxPrice,
    minRating,
    limit = 10,
    offset = 0,
  } = params;

  try {
    // Call the new SQL RPC function
    const { data, error } = await supabase.rpc('get_paginated_formations', {
      p_user_id: currentUserId,
      p_limit: limit,
      p_offset: offset,
      // Pass other filter parameters here if the SQL function supported them
      // For now, only user_id, limit, offset are supported by the SQL function
      // Additional filtering would need to be added to the SQL function or done client-side if performance allows.
    });

    if (error) {
      console.error("Error fetching paginated formations:", error);
      return { data: [], error: error.message };
    }

    // Client-side filtering as a fallback or for filters not handled by SQL RPC
    let filteredData = data;

    if (search) {
      filteredData = filteredData.filter(f =>
        f.title?.toLowerCase().includes(search.toLowerCase()) ||
        f.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (categorySlugs && categorySlugs.length > 0) {
      filteredData = filteredData.filter(f => categorySlugs.includes(f.category));
    }
    if (niveau) {
      filteredData = filteredData.filter(f => f.level === niveau);
    }
    if (mode) {
      filteredData = filteredData.filter(f => f.mode === mode); // mode not in current SQL output
    }
    if (certificat !== undefined) {
      filteredData = filteredData.filter(f => f.certificat === certificat); // certificat not in current SQL output
    }
    if (maxPrice !== undefined) {
      filteredData = filteredData.filter(f => parseFloat(f.price) <= maxPrice); // price is text, needs parsing
    }
    if (minRating !== undefined) {
      filteredData = filteredData.filter(f => (f.rating || 0) >= minRating);
    }


    return { data: filteredData, error: null };

  } catch (e: any) {
    console.error("Unexpected error in getPaginatedFormationsAction:", e);
    return { data: [], error: e.message || "An unexpected error occurred." };
  }
}

export async function createFormationInscription(formData: FormData) {
  const supabase = await createClient();

  const userResponse = await supabase.auth.getUser();
  if (userResponse.error || !userResponse.data.user) {
    return { error: "User not authenticated." };
  }
  const buyer_id = userResponse.data.user.id;

  // Extract data from formData
  const product_id = formData.get('product_id') as string; // Assuming formation_id is passed as product_id
  const price = parseFloat(formData.get('price') as string);
  const payment_method = formData.get('payment_method') as string;
  // seller_id would need to be fetched based on product_id or passed as hidden field

  if (!product_id || isNaN(price) || !payment_method) {
    return { error: "Missing required form fields." };
  }

  // TODO: Fetch seller_id based on product_id (formation_id)
  // For now, let's assume product_id directly maps to a product entry with an owner_id
  const { data: productData, error: productError } = await supabase
    .from('products') // Assuming formations are stored in the 'products' table
    .select('owner_id')
    .eq('product_id', product_id)
    .single();

  if (productError || !productData) {
    console.error("Error fetching product owner:", productError);
    return { error: "Failed to find product owner." };
  }
  const seller_id = productData.owner_id;


  const { data, error } = await supabase
    .from('orders') // Assuming 'orders' table for inscriptions
    .insert([
      {
        buyer_id: buyer_id,
        product_id: product_id,
        seller_id: seller_id, // Replace with actual seller ID
        price: price,
        status: 'pending', // Default status
        payment_method: payment_method,
        payment_status: 'pending',
        // delivery_address, tracking_number, delivery_status might not apply to formations
      },
    ])
    .select();

  if (error) {
    console.error("Error creating formation inscription:", error);
    return { error: error.message };
  }

  revalidatePath('/formations'); // Revalidate the formations page or related paths
  revalidatePath(`/formations/${product_id}`); // Revalidate the specific formation page

  return { data: data[0], error: null };
}
