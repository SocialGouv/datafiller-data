import { processThemes } from "../themes";

test("processThemes", () => {
  const input = [
    {
      id: "2",
      title: "theme 2",
      variants: "",
      position: 2,
      refs: [{ url: "url.2", title: "url2" }],
      parent: null,
      icon: "icon clock"
    },
    {
      id: "1",
      title: "theme 1",
      variants: "",
      position: 1,
      introduction: "I'm theme #1 !",
      refs: [{ url: "url.1" }],
      parent: null,
      icon: "icon page"
    },
    {
      id: "3",
      title: "theme1 > soustheme 2",
      variants: "sous-theme-1\nsous-theme2",
      position: 4,
      refs: [{ url: "fiche.url", title: "fiche url" }],
      parent: "1"
    },
    {
      id: "4",
      title: "theme1 > soustheme 1",
      variants: "",
      position: 3,
      refs: [{ url: "cdt.url", title: "cdt" }],
      parent: "1"
    }
  ];

  expect(processThemes(input)).toEqual([
    {
      title: "theme 2",
      variants: ["theme 2"],
      position: 2,
      icon: "icon clock",
      breadcrumbs: [],
      children: [],
      refs: [{ url: "url.2", title: "url2" }]
    },
    {
      title: "theme 1",
      variants: ["theme 1"],
      position: 1,
      icon: "icon page",
      introduction: "I'm theme #1 !",
      breadcrumbs: [],
      children: [
        { label: "theme1 > soustheme 1", position: 3 },
        { label: "theme1 > soustheme 2", position: 4 }
      ],
      refs: [{ url: "url.1", title: undefined }]
    },
    {
      title: "theme1 > soustheme 2",
      variants: ["theme1 > soustheme 2", "sous-theme-1", "sous-theme2"],
      position: 4,
      breadcrumbs: [{ label: "theme 1", position: 1 }],
      children: [],
      refs: [{ url: "fiche.url", title: "fiche url" }]
    },
    {
      title: "theme1 > soustheme 1",
      variants: ["theme1 > soustheme 1"],
      position: 3,
      breadcrumbs: [{ label: "theme 1", position: 1 }],
      children: [],
      refs: [{ url: "cdt.url", title: "cdt" }]
    }
  ]);
});
