import React from "react";
import BackToPrev from "../BackToPrev";

const Contact: React.FC = () => {
  return (
    <>
           <BackToPrev/>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
 
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Contact Us
        </h1>

        <form className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-transparent"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-transparent"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Write your message..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default Contact;
