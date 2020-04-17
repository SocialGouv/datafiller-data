import { processRequests } from "../savedRequests";

test("processRequests", async () => {
  const input = [
    {
      refs: [],
      title: "empty request"
    },
    {
      refs: [
        {
          url: "fiche url 3",
          title: "fiche 3",
          position: 2
        },
        {
          url: "cdt1",
          title: "article1",
          position: 1
        }, {
          title: "",
          url: "",
        }
      ],
      title: "cheque vacances",
      variants: "chèques vacances \nchèques vacances\n"
    }
  ];
  const rows = await processRequests(input);
  expect(rows).toEqual([
    {
      title: "cheque vacances",
      variants: ["cheque vacances", "chèques vacances"],
      refs: [
        {
          url: "cdt1",
          title: "article1",
          position: 1
        },
        {
          url: "fiche url 3",
          title: "fiche 3",
          position: 2
        }
      ]
    }
  ]);
});
