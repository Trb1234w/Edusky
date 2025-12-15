-- Schéma pour la table des Services
CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon_svg TEXT, -- Pour stocker directement un code SVG d'icône (léger et flexible)
    image_url TEXT, -- Au cas où une image plus complexe est nécessaire
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Schéma pour la table des soumissions du formulaire de contact
CREATE TABLE contact_submissions (
    submission_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

-- Schéma pour la table des témoignages
CREATE TABLE testimonials (
    testimonial_id SERIAL PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL,
    author_role VARCHAR(100),
    content TEXT NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
