const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const GRAPHQL_ENDPOINT = `${API_BASE_URL}/graphql`;

async function graphqlRequest(query, variables = {}, token) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify({ query, variables })
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || 'Network request failed');
  }

  if (payload?.errors?.length) {
    const [graphQLError] = payload.errors;
    throw new Error(graphQLError?.message || 'GraphQL request failed');
  }

  return payload?.data || {};
}

function buildHeaders(token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function parseJson(response) {
  try {
    return await response.json();
  } catch (error) {
    console.warn('Failed to parse JSON response', error);
    return null;
  }
}

export async function fetchApps({ category, search, limit = 12, offset = 0 } = {}) {
  const variables = { category, search, limit, offset };
  const data = await graphqlRequest(APPS_QUERY, variables);
  const connection = data?.apps || { edges: [], pageInfo: {} };
  const items = (connection.edges || []).map(normalizeAppRecord);

  return {
    items,
    pageInfo: connection.pageInfo || DEFAULT_PAGE_INFO
  };
}

export async function fetchFactChecks({ category, verdict, search, limit = 12, offset = 0 } = {}) {
  const variables = { category, verdict, search, limit, offset };
  const data = await graphqlRequest(FACT_CHECKS_QUERY, variables);
  const connection = data?.factChecks || { edges: [], pageInfo: {} };
  const items = (connection.edges || []).map(normalizeFactCheckRecord);

  return {
    items,
    pageInfo: connection.pageInfo || DEFAULT_PAGE_INFO
  };
}

export async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const variables = { input: { email, password } };
  const data = await graphqlRequest(LOGIN_MUTATION, variables);
  const authPayload = data?.login;

  if (!authPayload?.token) {
    throw new Error('Authentication failed');
  }

  return authPayload;
}

export async function submitFactCheck(input, token) {
  if (!token) {
    throw new Error('Authentication required');
  }

  const variables = { input };
  const data = await graphqlRequest(SUBMIT_FACT_CHECK_MUTATION, variables, token);
  const factCheck = data?.submitFactCheck;

  if (!factCheck) {
    throw new Error('Fact check submission failed');
  }

  return normalizeFactCheckRecord(factCheck);
}

const DEFAULT_PAGE_INFO = {
  hasNextPage: false,
  hasPreviousPage: false,
  startCursor: null,
  endCursor: null
};

const APPS_QUERY = `
  query Apps($category: String, $search: String, $limit: Int, $offset: Int) {
    apps(category: $category, search: $search, limit: $limit, offset: $offset) {
      edges {
        id
        name
        package_id: packageId
        category
        description
        developer
        icon_url: iconUrl
        website_url: websiteUrl
        privacy_score: privacyScore
        security_score: securityScore
        truth_rating: truthRating
        download_count: downloadCount
        platform
        is_verified: isVerified
        created_at: createdAt
        updated_at: updatedAt
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

const FACT_CHECKS_QUERY = `
  query FactChecks($category: String, $verdict: String, $search: String, $limit: Int, $offset: Int) {
    factChecks(category: $category, verdict: $verdict, search: $search, limit: $limit, offset: $offset) {
      edges {
        id
        claim
        verdict
        confidence_score: confidenceScore
        sources
        explanation
        category
        image_url: imageUrl
        blockchain_hash: blockchainHash
        upvotes
        downvotes
        created_at: createdAt
        updated_at: updatedAt
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      refreshToken
      user {
        id
        username
        email
        walletAddress
        role
        isVerified
        truthScore
      }
    }
  }
`;

const SUBMIT_FACT_CHECK_MUTATION = `
  mutation SubmitFactCheck($input: FactCheckInput!) {
    submitFactCheck(input: $input) {
      id
      claim
      verdict
      confidence_score: confidenceScore
      sources
      explanation
      category
      image_url: imageUrl
      blockchain_hash: blockchainHash
      upvotes
      downvotes
      created_at: createdAt
      updated_at: updatedAt
    }
  }
`;

function normalizeAppRecord(app = {}) {
  return {
    ...app,
    truth_rating: fallbackNumber(app.truth_rating ?? app.truthRating, 0),
    download_count: fallbackNumber(app.download_count ?? app.downloadCount, 0),
    updated_at: app.updated_at || app.updatedAt || null,
    icon_url: app.icon_url || app.iconUrl || null
  };
}

function normalizeFactCheckRecord(factCheck = {}) {
  return {
    ...factCheck,
    confidence_score: typeof factCheck.confidence_score === 'number'
      ? factCheck.confidence_score
      : factCheck.confidenceScore ?? 0,
    updated_at: factCheck.updated_at || factCheck.updatedAt || null,
    created_at: factCheck.created_at || factCheck.createdAt || null
  };
}

function fallbackNumber(value, defaultValue = 0) {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}
