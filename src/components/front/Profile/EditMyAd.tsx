import React from "react";

const EditMyAd: React.FC = () => {
    return (
        <div className="max-w-lg mx-auto mt-10 p-8 rounded-xl  bg-white flex flex-col gap-5">
            <h2 className="text-2xl font-semibold mb-2">Edit My Ad</h2>
            <form className="flex flex-col gap-5">
                <div>
                    <label className="font-medium mb-1 block" htmlFor="title">Title</label>
                    <input
                        className="px-3 py-2 rounded-md border border-gray-300 text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Enter ad title"
                    />
                </div>
                <div>
                    <label className="font-medium mb-1 block" htmlFor="description">Description</label>
                    <textarea
                        className="px-3 py-2 rounded-md border border-gray-300 text-base w-full min-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="description"
                        name="description"
                        placeholder="Enter ad description"
                    />
                </div>
                <div>
                    <label className="font-medium mb-1 block" htmlFor="price">Price</label>
                    <input
                        className="px-3 py-2 rounded-md border border-gray-300 text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Enter price"
                    />
                </div>
                <button
                    className="px-5 py-3 rounded-md bg-blue-600 text-white font-semibold text-base mt-2 hover:bg-blue-700 transition"
                    type="submit"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditMyAd;
