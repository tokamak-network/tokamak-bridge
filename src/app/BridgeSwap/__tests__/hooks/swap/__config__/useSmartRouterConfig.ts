import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { mockRoutingPathData } from "../__mocks__/useSmartRouter.mock";

const handlers = [
  http.get(`${process.env.NEXT_PUBLIC_ROUTING_API}/quote`, () => {
    return HttpResponse.json(mockRoutingPathData);
  }),
];

export const server = setupServer(...handlers);
