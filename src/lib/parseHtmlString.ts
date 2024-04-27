import { RecipeLD } from "../types";

function parseLDJSON(tags: NodeListOf<Element>): RecipeLD | undefined {
  let foundRecipeObjects: RecipeLD | [RecipeLD] | undefined;

  tags.forEach((value) => {
    if (
      value.textContent?.includes("Recipe") &&
      (value.textContent?.includes("://schema.org") ||
        value.textContent?.includes(":\\/\\/schema.org"))
    ) {
      const obj = JSON.parse(value.textContent ?? "{}");
      if (!Array.isArray(obj)) {
        if (obj["@type"] === "Recipe") {
          foundRecipeObjects = obj;
          console.log("found", foundRecipeObjects);
        } else if (Array.isArray(obj["@graph"])) {
          foundRecipeObjects = obj["@graph"] as RecipeLD | [RecipeLD];
        }
      } else {
        foundRecipeObjects = obj as RecipeLD | [RecipeLD];
        console.log("found arra", foundRecipeObjects);
      }
    }
  });

  if (Array.isArray(foundRecipeObjects)) {
    return foundRecipeObjects.find(
      (obj) => obj["@type"] === "Recipe" || obj["@type"].includes("Recipe"),
    );
  }

  return foundRecipeObjects;
}

// function parseMicrodata(doc: Document): RecipeLD | undefined {
//   const lookup = {
//     "*": "textContent",
//     meta: "content",
//     audio: "src",
//     embed: "src",
//     iframe: "src",
//     img: "src",
//     source: "src",
//     video: "src",
//     a: "href",
//     area: "href",
//     link: "href",
//     object: "data",
//     time: "datetime",
//   };

//   const itemType = "http://schema.org/Recipe";

//   function extract(scope) {
//     var obj = { _type: scope.getAttribute("itemtype") },
//       elems = [].slice.call(scope.children),
//       elem,
//       key;

//     /*jshint boss:true*/
//     while ((elem = elems.shift())) {
//       if ((key = elem.getAttribute("itemprop"))) add(obj, key, value(elem));
//       if (elem.getAttribute("itemscope") === null)
//         prepend(elems, elem.children);
//     }

//     return obj;
//   }

//   function add(obj, key, val) {
//     /*jshint eqnull:true*/
//     if (val == null) return;

//     var prop = obj[key];
//     if (prop == null) obj[key] = val;
//     else if (prop instanceof Array) prop.push(val);
//     else obj[key] = [prop, val];
//   }

//   function value(elem) {
//     if (elem.getAttribute("itemscope") !== null) return extract(elem);
//     var attr = lookup[elem.tagName.toLowerCase()] || lookup["*"];
//     return elem[attr] || elem.getAttribute(attr);
//   }

//   function prepend(target, addition) {
//     [].unshift.apply(target, [].slice.call(addition));
//   }

//   const elems = doc.querySelectorAll(
//     '[itemscope][itemtype="' + itemType + '"]'
//   );
//   const results = [];
//   for (var i = 0, len = elems.length; i < len; i++)
//     results.push(extract(elems[i]));
//   return results;
// }

export default function parseHtmlString(value: string): RecipeLD | undefined {
  const document = new DOMParser().parseFromString(value, "text/html");

  // first, try to find ld+json scripts
  const LDJsonScripts = document.querySelectorAll(
    'script[type="application/ld+json"]',
  );

  let foundLDRecipe = parseLDJSON(LDJsonScripts);

  if (!foundLDRecipe) {
    // try to parse Microdata
    // parseMicrodata(document);
  }

  console.log(foundLDRecipe);
  return foundLDRecipe;
}
