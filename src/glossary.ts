import fetch from "node-fetch";
import * as remark from "remark";
import * as html from "remark-html";
import { KintoResponse, Reference } from ".";

const compiler = remark().use(html, { sanitize: true });

type GlossaryRawItem = {
  title: string;
  abbrs: string;
  variants?: string;
  definition: string;
  refs: Reference[];
};

export type GlossaryItem = {
  title: string;
  abbrs: string;
  variants: string[];
  definition: string;
  refs: Reference[];
};

export function processGlossary(items: GlossaryRawItem[]): GlossaryItem[] {
  return items
    .filter(item => item.title && item.definition)
    .map(item => ({
      title: item.title.trim(),
      abbrs: item.abbrs.trim(),
      variants: [
        ...new Set(
          (item.variants || "")
            .split("\n")
            .map(v => v.trim())
            .filter(Boolean)
        )
      ],
      definition: compiler
        .processSync(item.definition)
        .contents.toString()
        .replace(/\n/g, "")
        .replace(/(\s)\s+/g, "$1"),
      refs: item.refs
    }))
    .sort(({ title: titleA }, { title: titleB }) =>
      titleA.localeCompare(titleB)
    );
}

export async function getGlossary(baseUrl: string): Promise<GlossaryItem[]> {
  const response = await fetch(
    `${baseUrl}/kinto/v1/buckets/datasets/collections/glossaire/records`
  );
  const items: KintoResponse<GlossaryRawItem[]> = await response.json();
  return processGlossary(items.data);
}

if (require.main === module) {
  getGlossary(`${process.env.DATAFILLER_URL}`)
    .then(data => {
      console.log(JSON.stringify(data, null, 2));
      console.error(`${data.length} termes extraits`);
    })
    .catch(error => console.error(error));
}
