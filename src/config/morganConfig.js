import express from "express";
import morgan from "morgan";

const middleware = new express.Router();

morgan.token("json", (req) => {
  if (req.body) {
    return `${JSON.stringify(req.body, null, 2)}`;
  }
  return " ";
});

middleware.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.json(req),
    ].join(" ");
  })
);

export default middleware;
