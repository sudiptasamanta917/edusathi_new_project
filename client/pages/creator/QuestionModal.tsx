import React, { useState } from "react";

type Option = {
    id: number;
    text: string;
    isCorrect: boolean;
};

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const QuestionModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [questionType, setQuestionType] = useState("single");
    const [points, setPoints] = useState(1);
    const [questionText, setQuestionText] = useState("");
    const [required, setRequired] = useState(false);
    const [feedback, setfeedback] = useState(false);
    const [options, setOptions] = useState<Option[]>([
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
    ]);
    const [randomize, setRandomize] = useState(false);
    const [setOptionPoints, setSetOptionPoints] = useState(false);

    const addOption = () => {
        setOptions([
            ...options,
            { id: Date.now(), text: "", isCorrect: false },
        ]);
    };

    const updateOption = (id: number, field: keyof Option, value: any) => {
        setOptions(
            options.map((opt) =>
                opt.id === id ? { ...opt, [field]: value } : opt
            )
        );
    };

    const removeOption = (id: number) => {
        setOptions(options.filter((opt) => opt.id !== id));
    };

    const handleSave = () => {
        // Placeholder for backend integration
        console.log({
            questionType,
            points,
            questionText,
            required,
            feedback,
            options,
            randomize,
            setOptionPoints,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]">
                <h2 className="text-xl font-semibold mb-4">
                    Create New Question
                </h2>

                {/* Question Type */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">
                        Question Type
                    </label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={questionType}
                        onChange={(e) => setQuestionType(e.target.value)}
                    >
                        <option value="single">
                            Single Choice (Radio Button)
                        </option>
                        <option value="multiple">
                            Multiple Choice (Checkbox)
                        </option>
                        <option value="fillblanks">Fill in the Blanks</option>
                        <option value="freetext">Free Text</option>
                    </select>
                </div>

                {/* Points */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Points</label>
                    <input
                        type="number"
                        className="w-full border rounded px-3 py-2"
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                    />
                </div>

                {/* Question Text */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Question</label>
                    <textarea
                        className="w-full border rounded px-3 py-2"
                        rows={4}
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                    />
                </div>

                {/* Required */}
                <div className="mb-4 flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={required}
                        onChange={(e) => setRequired(e.target.checked)}
                    />
                    <label>Required</label>
                    <input
                        type="checkbox"
                        checked={feedback}
                        onChange={(e) => setfeedback(e.target.checked)}
                        className="ml-4"
                    />
                    <label>Show question feedback</label>
                </div>

                {/* Options */}
                <div className="mb-4">
                    <label className="block font-medium mb-2">Options</label>
                    {options.map((opt) => (
                        <div
                            key={opt.id}
                            className="flex items-center gap-2 mb-2"
                        >
                            <input
                                type="text"
                                className="flex-1 border rounded px-3 py-2"
                                value={opt.text}
                                onChange={(e) =>
                                    updateOption(opt.id, "text", e.target.value)
                                }
                            />
                            <label className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={opt.isCorrect}
                                    onChange={(e) =>
                                        updateOption(
                                            opt.id,
                                            "isCorrect",
                                            e.target.checked
                                        )
                                    }
                                />
                                Correct
                            </label>
                            <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => removeOption(opt.id)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                        onClick={addOption}
                    >
                        Add Option
                    </button>
                </div>

                {/* Extra Options */}
                <div className="mb-4 flex gap-6">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={randomize}
                            onChange={(e) => setRandomize(e.target.checked)}
                        />
                        Randomize options
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={setOptionPoints}
                            onChange={(e) =>
                                setSetOptionPoints(e.target.checked)
                            }
                        />
                        Set option points
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 border rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={handleSave}
                    >
                        Save and Add Another
                    </button>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionModal;
