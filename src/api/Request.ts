type PayloadTypeOptions = {
  url: string;
  token?: string;
  headers?: Headers;
  body?: any;
  toJson?: boolean;
};
const server = import.meta.env.VITE_VUE_APP_BACKEND_SERVER + "/api";

function Get({ url, token, headers }: Omit<PayloadTypeOptions, "toJson" | "body">) {
  const headerMap = new Headers();
  if (token) {
    headerMap.set("Authorization", "Bearer " + token);
  }
  if (headers) {
    headers.forEach((v, k) => {
      headerMap.set(k, v);
    });
  }
  return fetch(server + url, {
    headers: headerMap,
  });
}
function Post({ url, body, toJson, token, headers }: PayloadTypeOptions) {
  const headerMap = new Headers();
  if (token) {
    headerMap.set("Authorization", "Bearer " + token);
  }
  if (headers) {
    headers.forEach((v, k) => {
      headerMap.set(k, v);
    });
  }
  if (toJson) {
    headerMap.set("Accept", "application/json");
    headerMap.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  return fetch(server + url, {
    method: "POST",
    headers: headerMap,
    body,
  });
}
function Put({ url, body, toJson, token, headers }: PayloadTypeOptions) {
  const headerMap = new Headers();
  if (token) {
    headerMap.set("Authorization", "Bearer " + token);
  }
  if (headers) {
    headers.forEach((v, k) => {
      headerMap.set(k, v);
    });
  }
  if (toJson) {
    headerMap.set("Accept", "application/json");
    headerMap.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }
  return fetch(server + url, {
    method: "PUT",
    headers: headerMap,
    body,
  });
}
function Patch({ url, body, toJson, token, headers }: PayloadTypeOptions) {
  const headerMap = new Headers();
  if (token) {
    headerMap.set("Authorization", "Bearer " + token);
  }
  if (headers) {
    headers.forEach((v, k) => {
      headerMap.set(k, v);
    });
  }
  if (toJson) {
    headerMap.set("Accept", "application/json");
    headerMap.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }
  return fetch(server + url, {
    method: "PATCH",
    headers: headerMap,
    body,
  });
}
function Del({ url, body, toJson, token, headers }: PayloadTypeOptions) {
  const headerMap = new Headers();
  if (token) {
    headerMap.set("Authorization", "Bearer " + token);
  }
  if (headers) {
    headers.forEach((v, k) => {
      headerMap.set(k, v);
    });
  }
  if (toJson) {
    headerMap.set("Accept", "application/json");
    headerMap.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }
  return fetch(server + url, {
    method: "DELETE",
    headers: headerMap,
    body,
  });
}

export { Get, Post, Put, Patch, Del };
