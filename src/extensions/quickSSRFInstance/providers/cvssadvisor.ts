export const CA_SSRF_INSTANCE_API_URL =
  "https://api.cvssadvisor.com/ssrf/api/instance";

interface CASSRFInstance {
  id: string;
  launch_timestamp: number;
  end_timestamp: number;
  response_data: {
    body: string;
    status_code: number;
    headers: {
      [key: string]: string;
    };
  };
  requests_history: any;
}

// POST https://api.cvssadvisor.com/ssrf/api/instance/$INSTANCE_ID {"statusCode":200,"body":"Hello","headers":"Access-Control-Allow-Headers: *"}
export const customizeHTTPResponse = async (
  instanceID: string,
  status: number,
  body: string,
  headers: string
) => {
  return fetch(`https://api.cvssadvisor.com/ssrf/api/instance/${instanceID}`, {
    method: "POST",
    body: JSON.stringify({
      statusCode: status,
      body: body,
      headers: headers,
    }),
  }).then((res) => res.ok);
};

// GET https://api.cvssadvisor.com/ssrf/api/instance/$INSTANCE_ID
export const getCASSRFInstance = async (
  instanceID: string
): Promise<CASSRFInstance> => {
  return fetch(
    `https://api.cvssadvisor.com/ssrf/api/instance/${instanceID}`
  ).then((res) => res.json());
};