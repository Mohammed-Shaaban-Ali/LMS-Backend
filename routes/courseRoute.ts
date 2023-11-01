import express from "express";
import {
  editCourse,
  getAllCourses,
  getCoursesByUser,
  getSingleCourse,
  uploadCourse,
} from "../controller/courseController";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const courseRoute = express.Router();

courseRoute.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRoute.get("/get-courses/", getAllCourses);

courseRoute.put(
  "/eidt-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);
courseRoute.get("/get-course/:id", getSingleCourse);

courseRoute.get("/get-course-content/:id", isAuthenticated, getCoursesByUser);
export default courseRoute;
