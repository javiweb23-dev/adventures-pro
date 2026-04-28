import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Tours")
        .schemaType("tour")
        .child(
          S.documentTypeList("tour")
            .title("Tours")
            .filter('_type == "tour" && slug.current != "water-tours"'),
        ),
      S.listItem()
        .title("Categories")
        .schemaType("category")
        .child(S.documentTypeList("category").title("Categories")),
      ...S.documentTypeListItems().filter(
        (item) => !["tour", "category"].includes(item.getId() ?? ""),
      ),
    ]);
