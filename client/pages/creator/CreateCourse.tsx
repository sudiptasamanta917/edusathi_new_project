import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CourseAPI } from "@/Api/api";

interface Course {
    title: string;
    description: string;
    subject: string;
    grade: string;
    level: string;
    thumbnail: string;
    isPaid: boolean;
    price: number;
}

interface CreateCourseProps {
    onSuccess?: (course: Course) => void;
}

const CreateCourse: React.FC<CreateCourseProps> = ({ onSuccess }) => {
    const [course, setCourse] = useState<Course>({
        title: "",
        description: "",
        subject: "",
        grade: "",
        level: "",
        thumbnail: "",
        isPaid: false,
        price: 0,
    });
    const [loading, setLoading] = useState(false);

    // Example enum lists
    const subjects = [
        "Programming",
        "Mathematics",
        "Science",
        "Arts",
        "Business",
    ];
    const grades = ["High School", "Undergraduate", "Postgraduate"];
    const levels = ["Beginner", "Intermediate", "Advanced"];

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type, checked } = e.target;
        setCourse((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("Submitting course data:", course);
            const response = await CourseAPI.createCourse(course);
            console.log("Create course API response:", response);

            if (response?.status) {
                alert(" Course created successfully!");
                setCourse({
                    title: "",
                    description: "",
                    subject: "",
                    grade: "",
                    level: "",
                    thumbnail: "",
                    isPaid: false,
                    price: 0,
                });
                onSuccess?.(course);
            } else {
                alert(
                    response?.error ||
                        " Failed to create course — check API or enums"
                );
            }
        } catch (error: any) {
            console.error("Error creating course:", error);
            alert(
                ` Something went wrong: ${error.message || "Unknown error"}`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-[#282828] mb-6">
            <CardHeader>
                <div className="text-lg font-semibold text-white">
                    Create Course
                </div>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 text-white"
                >
                    <input
                        type="text"
                        name="title"
                        placeholder="Course Title"
                        value={course.title}
                        onChange={handleChange}
                        required
                        className="p-2 rounded bg-gray-700 text-white w-full"
                    />

                    <textarea
                        name="description"
                        placeholder="Course Description"
                        value={course.description}
                        onChange={handleChange}
                        required
                        className="p-2 rounded bg-gray-700 text-white w-full"
                    />

                    {/* Subject Dropdown */}
                    <select
                        name="subject"
                        value={course.subject}
                        onChange={handleChange}
                        required
                        className="p-2 rounded bg-gray-700 text-white w-full"
                    >
                        <option value="">Select Subject</option>
                        {subjects.map((subj) => (
                            <option key={subj} value={subj}>
                                {subj}
                            </option>
                        ))}
                    </select>

                    {/* Grade Dropdown */}
                    <select
                        name="grade"
                        value={course.grade}
                        onChange={handleChange}
                        required
                        className="p-2 rounded bg-gray-700 text-white w-full"
                    >
                        <option value="">Select Grade</option>
                        {grades.map((grd) => (
                            <option key={grd} value={grd}>
                                {grd}
                            </option>
                        ))}
                    </select>

                    {/* Level Dropdown */}
                    <select
                        name="level"
                        value={course.level}
                        onChange={handleChange}
                        required
                        className="p-2 rounded bg-gray-700 text-white w-full"
                    >
                        <option value="">Select Level</option>
                        {levels.map((lvl) => (
                            <option key={lvl} value={lvl}>
                                {lvl}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        name="thumbnail"
                        placeholder="Thumbnail URL"
                        value={course.thumbnail}
                        onChange={handleChange}
                        className="p-2 rounded bg-gray-700 text-white w-full"
                    />

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isPaid"
                            checked={course.isPaid}
                            onChange={handleChange}
                            className="cursor-pointer"
                        />
                        <label>Paid Course</label>
                    </div>

                    {course.isPaid && (
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={course.price}
                            onChange={handleChange}
                            min="0"
                            className="p-2 rounded bg-gray-700 text-white w-full"
                        />
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="px-6 mt-2"
                    >
                        {loading ? "Creating..." : "Create Course"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateCourse;
