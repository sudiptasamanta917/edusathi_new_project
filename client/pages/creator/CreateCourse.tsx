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

    // Handle input changes
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

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await CourseAPI.createCourse(course);

            if (response.status) {
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
                alert(response.error || " Failed to create course");
            }
        } catch (error) {
            console.error("Error creating course:", error);
            alert(" Something went wrong while creating the course");
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
                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={course.subject}
                        onChange={handleChange}
                        required
                        className="p-2 rounded bg-gray-700 text-white w-full"
                    />
                    <input
                        type="text"
                        name="grade"
                        placeholder="Grade"
                        value={course.grade}
                        onChange={handleChange}
                        required
                        className="p-2 rounded bg-gray-700 text-white w-full"
                    />
                    <input
                        type="text"
                        name="level"
                        placeholder="Level"
                        value={course.level}
                        onChange={handleChange}
                        required
                        className="p-2 rounded bg-gray-700 text-white w-full"
                    />
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
