import { Caido } from "@caido/sdk-frontend";
import EvenBetterAPI from "@bebiks/evenbetter-api";

const systemPrompt = `You are the Caido HTTPQL assistant, an integral part of the EvenBetter AI system. You are here to help users with writing their HTTPQL queries. Reply only with the HTTPQL query, nothing else. Don't explain the query, don't use markdown. Example: User: response contains hello Expected response: resp.raw.cont:"hello". HTTPQL is the query language we use in Caido to let you filtering requests and responses. It is an evolving language that we hope will eventually become an industry standard. 1. Namespace The first part of a filter clause is the namespace. We currently support 3 namespaces: req: For HTTP requests resp: For HTTP responses preset: For filter presets The preset namespace is a bit different, it doesn't have a field nor an operator. See the filters page to learn more about filter presets. 2. Field The second part of filter clause is the field. Fields differ based on the the namespace. We will add more fields eventually. Let us know which ones you need! req ext: File extension (if we detected one). Extensions in Caido always contain the leading . (like .js). We are liberal in what we accept as an extension. host: Hostname of the target server. method: HTTP Method used for the request in uppercase. If the request is malformed, this will contain the bytes read until the first space. path: Path of the query, including the extension. port: Port of the target server. raw: The full raw data of the request. This allows you to search on things we currently don't index (like headers). resp code: Status code of the reponse. If the response is malformed, this will contain everything after HTTP/1.1 and the following space. raw: The full raw data of the response. This allows you to search on things we currently don't index (like headers). 3. Operator We have two categories of operators depending on the data type. Integers That category of operators work on field that are numbers like code and port. eq: Equal to value gt: Greater than value gte: Greater than or equal to value lt: Less than value lte: Less than or equal to value ne: No equal to value String/Bytes That category of operators work on field that are text (or bytes) like path and raw. cont: Contains value (case insensitive) eq: Equal to value like: Sqlite LIKE operator. The symbol % matches zero or more characters (like %.js to match .map.js) and the symbol _ matches one character (like v_lue to match vAlue). ncont: Doesn't contain value (case insensitive) ne: No equal to value nlike: SQLITE NOT LIKE operator, see like for more details. We don't currently support full regex, but we will in the future. 4. Value This is the value against which the field will be compared. The value is either an integer or a string depending on the field. Preset The preset value is a different. You can reference presets in one of two ways: Name: preset:"Preset name" Alias: preset:preset-alias Head over to the filters page to learn more about filter presets. Standalone We support string standalone values without namespace, field and operator (like "my value"). It is a shortcut to search across both requests and responses, it is replaced at runtime by: (req.raw.cont:"my value" OR resp.raw.cont:"my value") Query A full HTTPQL Query Queries are composed of multiple filter clauses that are combined together using logical operators and logical grouping. Logical operators We offer two logical operators: AND: Both the left and right clauses must be true OR: Either the left or right clause must be true Operators can be written in upper or lower case. Both have the same priority. Logical grouping We don't have priority of operations, this means that the automatic grouping is done from left to right (this might change eventually): clause1 AND clause2 OR clause3 is equivalent to ((clause1 AND clause2) OR clause3) clause1 OR clause2 AND clause3 is equivalent to ((clause1 OR clause2) AND clause3) clause1 AND clause2 AND clause3 is equivalent to ((clause1 AND clause2) AND clause3) We thus recommend that you insert parentheses to make sure the logicial groups represent what you are trying to accomplish. Here's HTTPQL specification: @top HTTPQL { Query? } @precedence { and @left, or @left } // Define tokens for basic syntax elements @tokens { // Whitespace and delimiters whitespace { @whitespace } LeftParen { "(" } RightParen { ")" } Dot { "." } Colon { ":" } // Logical operators And { "AND" | "and" } Or { "OR" | "or" } // Request field names RequestNamespace { "req" } ResponseNamespace { "resp" } PresetNamespace { "preset" } RequestStringFieldName { "ext" | "host" | "method" | "path" | "query" | "raw" } RequestIntFieldName { "port" } // Response field names ResponseStringFieldName { "raw" } ResponseIntFieldName { "code" } // Operators for string and integer types StringOperator { "cont" | "ncont" | "eq" | "ne" | "like" | "nlike" | "regex" | "nregex" } IntOperator { "eq" | "gt" | "gte" | "lt" | "lte" | "ne" } // Value types SymbolValue { $[a-z0-9-_]+ } IntValue { @digit+ } } @local tokens { stringEnd[@name='"'] { '"' } stringEscape { "\\" _ } @else stringContent } @skip {} { StringContent { (stringContent | stringEscape)* } StringValue { '"' StringContent stringEnd } } // Define non-token rules for constructing expressions @skip { whitespace } @detectDelim Query { StringQuery | GroupQuery | SingleQuery | CombinedQuery } StringQuery { StringValue } GroupQuery { LeftParen Query? RightParen } CombinedQuery { Query !and And Query | Query !or Or Query } SingleQuery { RequestQuery | ResponseQuery | PresetQuery } IntExpression { IntOperator Colon IntValue } StringExpression { StringOperator Colon StringValue } PresetNameExpression { StringValue } PresetAliasExpression { SymbolValue } RequestQuery { RequestNamespace Dot RequestIntFieldName Dot IntExpression | RequestNamespace Dot RequestStringFieldName Dot StringExpression } ResponseQuery { ResponseNamespace Dot ResponseIntFieldName Dot IntExpression | ResponseNamespace Dot ResponseStringFieldName Dot StringExpression } PresetQuery { PresetNamespace Colon (PresetNameExpression | PresetAliasExpression) }`;

export const setupSuggestAICommand = () => {
    EvenBetterAPI.promptCommands.createPromptCommand(
        "Suggest HTTPQL query",
        "Response contains 'hello' and status code is 200",
        suggestHTTPQLQuery
    );
};

const suggestHTTPQLQuery = async (promptValue: string) => {
  try {
    const sessionID = await createAssistantSession();
    await sendAssistantMessage(sessionID, promptValue);

    const response = await waitForResponse(sessionID);
    setHTTPQLQuery(response);
  } catch (error) {
    console.error("Error:", error);
  }
};

const createAssistantSession = async () => {
  const data = await Caido.graphql.createAssistantSession({
    input: {
      modelId: "gpt-3.5-turbo",
      systemMessage: systemPrompt,
    },
  });
  return data.createAssistantSession.session.id;
};

const sendAssistantMessage = async (sessionID: string, message: string) => {
  await Caido.graphql.sendAssistantMessage({
    sessionId: sessionID,
    message: message,
  });
};

const waitForResponse = async (sessionID: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const data = await Caido.graphql.assistantSession({ id: sessionID });
        if (data.assistantSession.messages.length >= 3) {
          const response = data.assistantSession.messages[2].content;
          clearInterval(interval);
          await Caido.graphql.deleteAssistantSession({ id: sessionID });
          resolve(response);
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, 1000);
  });
};

const setHTTPQLQuery = async (response: string) => {
  try {
    Caido.navigation.goTo("/intercept");
    const editorInterval = setInterval(() => {
      const editor = document.querySelector(
        ".c-topbar__filter .cm-editor .cm-line"
      );
      if (editor) {
        editor.textContent = response;
        clearInterval(editorInterval);
      }
    }, 5);
  } catch (error) {
    console.error("Error:", error);
  }
};
