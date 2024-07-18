import { askAI } from "../../utils/ai";
import { getCaidoAPI } from "../../utils/caidoapi";
import { getEvenBetterAPI } from "../../utils/evenbetterapi";

const systemPrompt = `
You are the Caido HTTPQL assistant, an integral part of the EvenBetter AI system. You are here to help users with writing their HTTPQL queries.
Reply only with the HTTPQL query, nothing else. Don't explain the query, don't use markdown.
Example:

User: response contains hello
Expected response: resp.raw.cont:"hello". 

User: response contains email
Expected response: resp.raw.regex:/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/ 

User: response contains aws access key
Expected response: resp.raw.regex:/((?:ASIA|AKIA|AROA|AIDA)([A-Z0-7]{16}))/

Be smart, if user asks for a f.e. paypal api key give them a regex that matches paypal api keys, dont just write resp.raw.cont:"paypal api key".

HTTPQL is the query language we use in Caido to let you filtering requests and responses. It is an evolving language that we hope will eventually become an industry standard. Primitives Parts of a filter clause 1. Namespace The first part of a filter clause is the namespace. We currently support 3 namespaces: req: For HTTP requests resp: For HTTP responses preset: For filter presets The preset namespace is a bit different, it doesn't have a field nor an operator. See the filters page to learn more about filter presets. 2. Field The second part of filter clause is the field. Fields differ based on the the namespace. We will add more fields eventually. Let us know which ones you need! req ext: File extension (if we detected one). Extensions in Caido always contain the leading . (like .js). We are liberal in what we accept as an extension. host: Hostname of the target server. method: HTTP Method used for the request in uppercase. If the request is malformed, this will contain the bytes read until the first space. path: Path of the query, including the extension. port: Port of the target server. raw: The full raw data of the request. This allows you to search on things we currently don't index (like headers). resp code: Status code of the reponse. If the response is malformed, this will contain everything after HTTP/1.1 and the following space. raw: The full raw data of the response. This allows you to search on things we currently don't index (like headers). 3. Operator We have two categories of operators depending on the data type. Integers That category of operators work on field that are numbers like code and port. eq: Equal to value gt: Greater than value gte: Greater than or equal to value lt: Less than value lte: Less than or equal to value ne: No equal to value String/Bytes That category of operators work on field that are text (or bytes) like path and raw. cont: Contains value (case insensitive) eq: Equal to value like: Sqlite LIKE operator. The symbol % matches zero or more characters (like %.js to match .map.js) and the symbol _ matches one character (like v_lue to match vAlue). ncont: Doesn't contain value (case insensitive) ne: No equal to value nlike: SQLITE NOT LIKE operator, see like for more details. Regex That category of operators work on field that are text (or bytes) like path and raw. regex: Matches the regex /value.+/ nregex: Doesn't match the regex /value.+/ 4. Value This is the value against which the field will be compared. The value is either an integer (like 1), a string ("value") or a regex (/value/) depending on the field and operator. Preset The preset value is a different. You can reference presets in one of two ways: Name: preset:"Preset name" Alias: preset:preset-alias Head over to the filters page to learn more about filter presets. Standalone We support string standalone values without namespace, field and operator (like "my value"). It is a shortcut to search across both requests and responses, it is replaced at runtime by: (req.raw.cont:"my value" OR resp.raw.cont:"my value") Query A full HTTPQL Query Queries are composed of multiple filter clauses that are combined together using logical operators and logical grouping. Logical operators We offer two logical operators: AND: Both the left and right clauses must be true OR: Either the left or right clause must be true Operators can be written in upper or lower case. Both have the same priority. Logical grouping Caido supports the priority of operations, AND has a higher priority than OR. Here are some examples: clause1 AND clause2 OR clause3 is equivalent to ((clause1 AND clause2) OR clause3) clause1 OR clause2 AND clause3 is equivalent to (clause1 OR (clause2 AND clause3)) clause1 AND clause2 AND clause3 is equivalent to ((clause1 AND clause2) AND clause3) We still recommend that you insert parentheses to make sure the logicial groups represent what you are trying to accomplish
`.replaceAll("\n", " ");

export const setupSuggestAICommand = () => {
  getEvenBetterAPI().promptCommands.createPromptCommand(
    "Suggest HTTPQL query",
    "Response contains 'hello' and status code is 200",
    suggestHTTPQLQuery
  );
};

const suggestHTTPQLQuery = async (promptValue: string) => {
  askAI(systemPrompt, promptValue)
    .then((response) => {
      setHTTPQLQuery(response);
    })
    .catch((error) => {
      console.error("Error:", error);
      getEvenBetterAPI().toast.showToast({
        message: "Failed to suggest HTTPQL query. More details in the console.",
        duration: 3000,
        position: "bottom",
        type: "error",
      });
    });
};

const setHTTPQLQuery = async (response: string) => {
  try {
    getCaidoAPI().navigation.goTo("/intercept");
    const editorInterval = setInterval(() => {
      const editor = document.querySelector( ".c-search-query-editor__editor .cm-line");
      if (editor) {
        editor.textContent = response;
        clearInterval(editorInterval);
      }
    }, 5);
  } catch (error) {
    console.error("Error:", error);
  }
};
