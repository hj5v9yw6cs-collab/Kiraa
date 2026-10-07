// The only module the app reads content through. To move to a CMS, write
// another source exposing these six functions and change this one line.
export { getModeling, getProfile, getProjects, getProject, getSite } from "./local";
export type * from "./types";
