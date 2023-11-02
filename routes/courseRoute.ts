import express from "express";
import {
  addAnswer,
  addQuestions,
  addReplay,
  addReview,
  editCourse,
  getAllCourses,
  getAllcoursesAdmin,
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

courseRoute.get("/get-courses", getAllCourses);
courseRoute.get(
  "/get-all-courses",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllcoursesAdmin
);

courseRoute.put("/add-qusetion", isAuthenticated, addQuestions);
courseRoute.put("/add-answer", isAuthenticated, addAnswer);

courseRoute.put(
  "/eidt-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);
courseRoute.get("/get-course/:id", getSingleCourse);
courseRoute.put("/add-review/:id", isAuthenticated, addReview);
courseRoute.put(
  "/add-replay",
  isAuthenticated,
  authorizeRoles("admin"),
  addReplay
);

courseRoute.get("/get-course-content/:id", isAuthenticated, getCoursesByUser);
export default courseRoute;
