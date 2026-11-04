import type { Metadata } from "next";
import { FavouritesContent } from "@/features/favourites/components/favourites-content";
import { favouritesCopy } from "@/features/favourites/copy";

export const metadata: Metadata = { title: favouritesCopy.title };

export default function FavouritesPage() {
  return (
    <main className="mx-auto w-full max-w-300 px-4 py-6 lg:px-8 lg:py-10">
      <h1 className="mb-6 text-2xl font-semibold lg:text-3xl">{favouritesCopy.title}</h1>
      <FavouritesContent />
    </main>
  );
}
