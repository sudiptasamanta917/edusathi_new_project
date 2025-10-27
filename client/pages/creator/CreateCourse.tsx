import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, Upload, Image, Video } from "lucide-react";
import { CourseAPI } from "@/Api/api";
import { useToast } from "@/hooks/use-toast";

interface Course {
    title: string;
    description: string;
    shortDescription: string;
    subject: string;
    grade: string;
    level: string;
    isPaid: boolean;
    price: number;
    originalPrice: number;
    currency: string;
    maxStudents: number;
    duration: number;
    language: string;
    difficulty: string;
    category: string;
    tags: string[];
    features: string[];
    requirements: string[];
    targetAudience: string[];
    learningOutcomes: string[];
    isPublished: boolean;
}

interface CreateCourseProps {
    onSuccess?: (course: any) => void;
}

const CreateCourse: React.FC<CreateCourseProps> = ({ onSuccess }) => {
    const { toast } = useToast();
    const [course, setCourse] = useState<Course>({
        title: "",
        description: "",
        shortDescription: "",
        subject: "",
        grade: "",
        level: "",
        isPaid: false,
        price: 0,
        originalPrice: 0,
        currency: "INR",
        maxStudents: 0,
        duration: 0,
        language: "English",
        difficulty: "Beginner",
        category: "General",
        tags: [],
        features: [],
        requirements: [],
        targetAudience: [],
        learningOutcomes: [],
        isPublished: false,
    });
    
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [previewVideoFile, setPreviewVideoFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
    const [loading, setLoading] = useState(false);
    
    // Input states for dynamic arrays
    const [newTag, setNewTag] = useState("");
    const [newFeature, setNewFeature] = useState("");
    const [newRequirement, setNewRequirement] = useState("");
    const [newTargetAudience, setNewTargetAudience] = useState("");
    const [newLearningOutcome, setNewLearningOutcome] = useState("");

    // Enum lists matching backend schema
    const subjects = [
        "Mathematics",
        "Science", 
        "English",
        "History",
        "Programming",
        "Arts",
        "Other"
    ];
    const grades = [
        "6th", "7th", "8th", "9th", "10th", "11th", "12th", 
        "Undergraduate", "Graduate"
    ];
    const levels = ["Beginner", "Intermediate", "Advanced"];
    const languages = ["English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi"];
    const categories = ["Programming", "Mathematics", "Science", "Language", "Arts", "Business", "Technology", "Health", "Other"];

    // File handling functions
    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnailFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setThumbnailPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePreviewVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewVideoFile(file);
        }
    };

    // Dynamic array management functions
    const addTag = () => {
        if (newTag.trim() && !course.tags.includes(newTag.trim())) {
            setCourse(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
            setNewTag("");
        }
    };

    const removeTag = (index: number) => {
        setCourse(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
    };

    const addFeature = () => {
        if (newFeature.trim() && !course.features.includes(newFeature.trim())) {
            setCourse(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
            setNewFeature("");
        }
    };

    const removeFeature = (index: number) => {
        setCourse(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
    };

    const addRequirement = () => {
        if (newRequirement.trim() && !course.requirements.includes(newRequirement.trim())) {
            setCourse(prev => ({ ...prev, requirements: [...prev.requirements, newRequirement.trim()] }));
            setNewRequirement("");
        }
    };

    const removeRequirement = (index: number) => {
        setCourse(prev => ({ ...prev, requirements: prev.requirements.filter((_, i) => i !== index) }));
    };

    const addTargetAudience = () => {
        if (newTargetAudience.trim() && !course.targetAudience.includes(newTargetAudience.trim())) {
            setCourse(prev => ({ ...prev, targetAudience: [...prev.targetAudience, newTargetAudience.trim()] }));
            setNewTargetAudience("");
        }
    };

    const removeTargetAudience = (index: number) => {
        setCourse(prev => ({ ...prev, targetAudience: prev.targetAudience.filter((_, i) => i !== index) }));
    };

    const addLearningOutcome = () => {
        if (newLearningOutcome.trim() && !course.learningOutcomes.includes(newLearningOutcome.trim())) {
            setCourse(prev => ({ ...prev, learningOutcomes: [...prev.learningOutcomes, newLearningOutcome.trim()] }));
            setNewLearningOutcome("");
        }
    };

    const removeLearningOutcome = (index: number) => {
        setCourse(prev => ({ ...prev, learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index) }));
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target;
        const checked = 'checked' in e.target ? e.target.checked : false;
        setCourse((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate required fields
            if (!course.title || !course.description || !course.subject || !course.grade || !course.level) {
                toast({
                    title: "Validation Error",
                    description: "Please fill in all required fields",
                    variant: "destructive"
                });
                setLoading(false);
                return;
            }

            // Create FormData for file upload
            const formData = new FormData();
            
            // Add all course fields to FormData
            Object.entries(course).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value.toString());
                }
            });

            // Add files if selected
            if (thumbnailFile) {
                formData.append('thumbnail', thumbnailFile);
            }
            if (previewVideoFile) {
                formData.append('previewVideo', previewVideoFile);
            }

            console.log("Submitting course data with files...");
            
            // Call API with FormData - Check both localStorage and sessionStorage
            const token = 
                sessionStorage.getItem('access_token') || 
                localStorage.getItem('access_token') || 
                sessionStorage.getItem('accessToken') || 
                localStorage.getItem('accessToken') || 
                localStorage.getItem('token');
            
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/creator/courses/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            const result = await response.json();
            console.log("Create course API response:", result);

            if (result?.status) {
                toast({
                    title: "Success!",
                    description: "Course created successfully!",
                });
                
                // Reset form
                setCourse({
                    title: "",
                    description: "",
                    shortDescription: "",
                    subject: "",
                    grade: "",
                    level: "",
                    isPaid: false,
                    price: 0,
                    originalPrice: 0,
                    currency: "INR",
                    maxStudents: 0,
                    duration: 0,
                    language: "English",
                    difficulty: "Beginner",
                    category: "General",
                    tags: [],
                    features: [],
                    requirements: [],
                    targetAudience: [],
                    learningOutcomes: [],
                    isPublished: false,
                });
                
                setThumbnailFile(null);
                setPreviewVideoFile(null);
                setThumbnailPreview("");
                
                onSuccess?.(result.data.course);
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to create course",
                    variant: "destructive"
                });
            }
        } catch (error: any) {
            console.error("Error creating course:", error);
            toast({
                title: "Error",
                description: `Something went wrong: ${error.message || "Unknown error"}`,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <Card className="bg-[#282828] border-gray-700">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white">Create New Course</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="title" className="text-gray-300">Course Title *</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={course.title}
                                        onChange={handleChange}
                                        placeholder="Enter course title"
                                        className="bg-[#2a2a2a] border-gray-700 text-white focus:border-blue-500"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="category" className="text-gray-300">Category</Label>
                                    <Select value={course.category} onValueChange={(value) => setCourse(prev => ({ ...prev, category: value }))}>
                                        <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description" className="text-gray-300">Description *</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={course.description}
                                    onChange={handleChange}
                                    placeholder="Detailed course description"
                                    className="bg-[#2a2a2a] border-gray-700 text-white focus:border-blue-500"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="shortDescription" className="text-gray-300">Short Description</Label>
                                <Textarea
                                    id="shortDescription"
                                    name="shortDescription"
                                    value={course.shortDescription}
                                    onChange={handleChange}
                                    placeholder="Brief course summary"
                                    className="bg-[#2a2a2a] border-gray-700 text-white focus:border-blue-500"
                                    rows={2}
                                />
                            </div>
                        </div>

                        {/* Course Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Course Details</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="subject" className="text-gray-300">Subject *</Label>
                                    <Select value={course.subject} onValueChange={(value) => setCourse(prev => ({ ...prev, subject: value }))}>
                                        <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                                            <SelectValue placeholder="Select subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subjects.map((subj) => (
                                                <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="grade" className="text-gray-300">Grade *</Label>
                                    <Select value={course.grade} onValueChange={(value) => setCourse(prev => ({ ...prev, grade: value }))}>
                                        <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                                            <SelectValue placeholder="Select grade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {grades.map((grade) => (
                                                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="level" className="text-gray-300">Difficulty Level *</Label>
                                    <Select value={course.level} onValueChange={(value) => setCourse(prev => ({ ...prev, level: value }))}>
                                        <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {levels.map((level) => (
                                                <SelectItem key={level} value={level}>{level}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="language" className="text-gray-300">Language</Label>
                                    <Select value={course.language} onValueChange={(value) => setCourse(prev => ({ ...prev, language: value }))}>
                                        <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {languages.map((lang) => (
                                                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="duration" className="text-gray-300">Duration (hours)</Label>
                                    <Input
                                        id="duration"
                                        name="duration"
                                        type="number"
                                        value={course.duration}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="bg-[#2a2a2a] border-gray-700 text-white focus:border-blue-500"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="maxStudents" className="text-gray-300">Max Students</Label>
                                    <Input
                                        id="maxStudents"
                                        name="maxStudents"
                                        type="number"
                                        value={course.maxStudents}
                                        onChange={handleChange}
                                        placeholder="0 (unlimited)"
                                        className="bg-[#2a2a2a] border-gray-700 text-white focus:border-blue-500"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Media Upload */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Media</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Thumbnail Upload */}
                                <div>
                                    <Label htmlFor="thumbnail" className="text-gray-300">Course Thumbnail</Label>
                                    <div className="mt-2">
                                        <Input
                                            id="thumbnail"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailChange}
                                            className="hidden"
                                        />
                                        <div 
                                            className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 transition-colors bg-[#2a2a2a]"
                                            onClick={() => document.getElementById('thumbnail')?.click()}
                                        >
                                            {thumbnailPreview ? (
                                                <div className="space-y-2">
                                                    <img src={thumbnailPreview} alt="Thumbnail preview" className="mx-auto h-32 w-auto rounded" />
                                                    <p className="text-sm text-gray-300">Click to change thumbnail</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                                                    <p className="text-sm text-gray-300">Click to upload thumbnail</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Preview Video Upload */}
                                <div>
                                    <Label htmlFor="previewVideo" className="text-gray-300">Preview Video (Optional)</Label>
                                    <div className="mt-2">
                                        <Input
                                            id="previewVideo"
                                            type="file"
                                            accept="video/*"
                                            onChange={handlePreviewVideoChange}
                                            className="hidden"
                                        />
                                        <div 
                                            className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 transition-colors bg-[#2a2a2a]"
                                            onClick={() => document.getElementById('previewVideo')?.click()}
                                        >
                                            {previewVideoFile ? (
                                                <div className="space-y-2">
                                                    <Video className="mx-auto h-12 w-12 text-green-500" />
                                                    <p className="text-sm text-gray-300">{previewVideoFile.name}</p>
                                                    <p className="text-xs text-gray-400">Click to change video</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <Video className="mx-auto h-12 w-12 text-gray-400" />
                                                    <p className="text-sm text-gray-300">Click to upload preview video</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Pricing</h3>
                            
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isPaid"
                                    checked={course.isPaid}
                                    onCheckedChange={(checked) => setCourse(prev => ({ ...prev, isPaid: !!checked }))}
                                />
                                <Label htmlFor="isPaid" className="text-gray-300">This is a paid course</Label>
                            </div>

                            {course.isPaid && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="price" className="text-gray-300">Price *</Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            value={course.price}
                                            onChange={handleChange}
                                            placeholder="0"
                                            className="bg-[#2a2a2a] border-gray-700 text-white focus:border-blue-500"
                                            min="0"
                                            required={course.isPaid}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="originalPrice" className="text-gray-300">Original Price</Label>
                                        <Input
                                            id="originalPrice"
                                            name="originalPrice"
                                            type="number"
                                            value={course.originalPrice}
                                            onChange={handleChange}
                                            placeholder="0"
                                            className="bg-[#2a2a2a] border-gray-700 text-white focus:border-blue-500"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="currency" className="text-gray-300">Currency</Label>
                                        <Select value={course.currency} onValueChange={(value) => setCourse(prev => ({ ...prev, currency: value }))}>
                                            <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="INR">INR (₹)</SelectItem>
                                                <SelectItem value="USD">USD ($)</SelectItem>
                                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Dynamic Arrays */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white">Course Features & Details</h3>
                            
                            {/* Tags */}
                            <div>
                                <Label className="text-gray-300">Tags</Label>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Add tag"
                                        className="bg-[#2a2a2a] border-gray-700 text-white focus:border-blue-500"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    />
                                    <Button type="button" onClick={addTag} size="sm">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {course.tags.map((tag, index) => (
                                        <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                                            {tag}
                                            <button type="button" onClick={() => removeTag(index)} className="text-blue-600 hover:text-blue-800">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Features */}
                            <div>
                                <Label className="text-gray-300">Course Features</Label>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        value={newFeature}
                                        onChange={(e) => setNewFeature(e.target.value)}
                                        placeholder="Add feature"
                                        className="bg-[#2a2a2a] border-gray-700 text-white focus:border-blue-500"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                    />
                                    <Button type="button" onClick={addFeature} size="sm">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {course.features.map((feature, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                                            <span className="text-white">{feature}</span>
                                            <button type="button" onClick={() => removeFeature(index)} className="text-red-600 hover:text-red-800">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Requirements */}
                            <div>
                                <Label className="text-gray-300">Requirements</Label>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        value={newRequirement}
                                        onChange={(e) => setNewRequirement(e.target.value)}
                                        placeholder="Add requirement"
                                        className="bg-[#2a2a2a] border-gray-700 text-white focus:border-blue-500"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                                    />
                                    <Button type="button" onClick={addRequirement} size="sm">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {course.requirements.map((req, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                                            <span className="text-white">{req}</span>
                                            <button type="button" onClick={() => removeRequirement(index)} className="text-red-600 hover:text-red-800">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Target Audience */}
                            <div>
                                <Label className="text-gray-300">Target Audience</Label>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        value={newTargetAudience}
                                        onChange={(e) => setNewTargetAudience(e.target.value)}
                                        placeholder="Add target audience"
                                        className="bg-[#2a2a2a] border-gray-700 text-white focus:border-blue-500"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTargetAudience())}
                                    />
                                    <Button type="button" onClick={addTargetAudience} size="sm">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {course.targetAudience.map((audience, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                                            <span className="text-white">{audience}</span>
                                            <button type="button" onClick={() => removeTargetAudience(index)} className="text-red-600 hover:text-red-800">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Learning Outcomes */}
                            
                        </div>

                        {/* Publication Settings */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Publication</h3>
                            
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isPublished"
                                    checked={course.isPublished}
                                    onCheckedChange={(checked) => setCourse(prev => ({ ...prev, isPublished: !!checked }))}
                                />
                                <Label htmlFor="isPublished" className="text-gray-300">Publish course immediately</Label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Creating..." : "Create Course"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateCourse;
