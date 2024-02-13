const Sidebar = () => {
    return (
        <div className="bg-gray-800 text-white min-h-full w-64 flex flex-col">
            <div className="p-4"> {/* Sidebar header */}
                <h1 className="text-lg font-semibold">My App</h1>
            </div>
            <div className="flex-grow"> {/* Sidebar content */}
                <ul className="px-4">
                    <li className="py-2"><a href="/" className="block text-white">Home</a></li>
                    <li className="py-2"><a href="/about" className="block text-white">About</a></li>
                    <li className="py-2"><a href="/contact" className="block text-white">Contact</a></li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
