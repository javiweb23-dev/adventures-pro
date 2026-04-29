import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./category";
import { localizedStringType } from "./localizedString";
import { localizedTextType } from "./localizedText";
import { postType } from "./post";
import { reviewType } from "./review";
import { teamMemberType } from "./teamMember";
import { tourType } from "./tour";
import { landingPageType } from "./landingPage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    localizedStringType,
    localizedTextType,
    categoryType,
    tourType,
    postType,
    reviewType,
    teamMemberType,
    landingPageType,
  ],
};