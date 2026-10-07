// The only module the app reads content through. To move to a CMS, write
// another source exposing these five functions and change this one line.
export { getProfile, getProjects, getProject, getSite } from "./local";
export type * from "./types";
