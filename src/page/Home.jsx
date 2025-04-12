import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold mb-4"
            >
                Welcome to SpeakFlow 🎙️
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-gray-300 mb-6 text-center max-w-md"
            >
                Your personal AI-powered communication trainer! Practice your speaking skills with real-time feedback and AI-generated responses.
            </motion.p>
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Link to="/communicate" 
                    className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-full text-lg shadow-lg transition duration-300"
                >
                    Start Communicating 🚀
                </Link>
            </motion.div>
            <h1 className="mt-6 text-sm text-gray-400">
                &copy; 2025 Harish
            </h1>
        </div>
    );
};

export default Home;
