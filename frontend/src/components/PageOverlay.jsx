export default function PageOverlay({ children, className }) {
    return (
        <div
            className={`  fixed top-0 right-0 bottom-0  border- bg-black bg-opacity-70 z-50 h- w-screen
                    flex flex-col justify-center items-center ${className}`}
        >
            {children}
        </div>
    );
}
