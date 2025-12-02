"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const CustomBottomSheet = DialogPrimitive.Root

const CustomBottomSheetTrigger = DialogPrimitive.Trigger

const CustomBottomSheetPortal = DialogPrimitive.Portal

const CustomBottomSheetClose = DialogPrimitive.Close

const CustomBottomSheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
CustomBottomSheetOverlay.displayName = DialogPrimitive.Overlay.displayName

const CustomBottomSheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { noBodyStyles?: boolean }
>(({ className, children, noBodyStyles, ...props }, ref) => (
  <CustomBottomSheetPortal>
    <CustomBottomSheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed bottom-0 left-0 z-50 flex flex-col w-full max-h-[85vh] border-t bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full rounded-t-2xl",
        className
      )}
      {...props}
    >
      {/* Fixed header with close button */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-background rounded-t-2xl shrink-0">
        <div className="w-12 h-1 bg-muted rounded-full mx-auto absolute left-1/2 -translate-x-1/2 -top-3" />
        <DialogPrimitive.Close className="ml-auto rounded-full p-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </div>

      {/* Content */}
      {noBodyStyles ? (
        children
      ) : (
        <div className="overflow-y-auto px-6 pb-6">
          {children}
        </div>
      )}
    </DialogPrimitive.Content>
  </CustomBottomSheetPortal>
))
CustomBottomSheetContent.displayName = DialogPrimitive.Content.displayName

const CustomBottomSheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left pt-4 pb-2", className)} {...props} />
)
CustomBottomSheetHeader.displayName = "CustomBottomSheetHeader"

const CustomBottomSheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
CustomBottomSheetFooter.displayName = "CustomBottomSheetFooter"

const CustomBottomSheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CustomBottomSheetTitle.displayName = DialogPrimitive.Title.displayName

const CustomBottomSheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CustomBottomSheetDescription.displayName = DialogPrimitive.Description.displayName

export {
  CustomBottomSheet,
  CustomBottomSheetPortal,
  CustomBottomSheetOverlay,
  CustomBottomSheetTrigger,
  CustomBottomSheetClose,
  CustomBottomSheetContent,
  CustomBottomSheetHeader,
  CustomBottomSheetFooter,
  CustomBottomSheetTitle,
  CustomBottomSheetDescription,
}
