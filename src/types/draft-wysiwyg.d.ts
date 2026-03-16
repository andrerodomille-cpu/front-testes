declare module "react-draft-wysiwyg";

declare module "draftjs-to-html" {
  import { RawDraftContentState } from "draft-js";
  function draftToHtml(contentState: RawDraftContentState): string;
  export default draftToHtml;
}

declare module "html-to-draftjs" {
  import { ContentBlock } from "draft-js";

  interface HTMLtoDraftOutput {
    contentBlocks: ContentBlock[];
    entityMap: Record<string, any>;
  }

  function htmlToDraft(html: string): HTMLtoDraftOutput;
  export default htmlToDraft;
}
