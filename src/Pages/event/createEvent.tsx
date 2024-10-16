import React, { useState } from "react";
import Slider from "react-slick"; // Thêm Slider từ react-slick
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
let event1 = require("../../Asset/event-1.jpg");
let event2 = require("../../Asset/event-2.jpg");
let event3 = require("../../Asset/event-3.jpg");

const ImageVideoBlock = () => {
    return (
            <div className="w-full bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Add images and video</h2>
                <h3 className="text-lg font-semibold mb-2">Image</h3>
                <div className="w-full bg-gray-200 border-dashed border-2 border-gray-300 h-48 flex flex-col justify-center items-center rounded-md mb-4">
                    <div className="text-center">
                        <i className="fas fa-image mb-2"></i>
                        <p>Drag and drop an image or</p>
                        <button className="bg-gray-300 px-4 py-2 mt-2 rounded">Upload Image</button>
                    </div>
                </div>
                <p className="text-sm text-gray-500">
                    Recommended image size: 2160 x 1080px • Maximum file size: 10MB • Supported image files: JPEG, PNG
                </p>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Video</h3>
                    <p className="text-sm text-gray-500 mb-2">
                        Add a video link from Youtube or Vimeo to show your event’s vibe.
                    </p>
                    <input
                        type="text"
                        placeholder="URL"
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>
            </div>
        
    );
};

const TitleBlock = () => {
    return (
        <div className="w-full bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Event Overview</h2>
                <h3 className="text-lg font-semibold mb-2">Event title</h3>
                <p className="text-sm text-gray-500">
                    Be clear and descriptive with a title that tells people what your event is about.
                </p>
                <input
                        type="text"
                        placeholder="Event title"
                        className="w-full px-4 py-2 border rounded-md"
                    />
                    <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <p className="text-sm text-gray-500">
                Grab people's attention with a short description about your event. Attendees will see this at the top of your event page. (140 characters max)
                </p>
                <textarea
                        placeholder="Summary"
                        className="w-full px-4 py-2 border rounded-md"
                    />
            </div>
    );
};
const EventDateTimeLocation = () => {
    const [showMap, setShowMap] = useState(true); // State để ẩn/hiện bản đồ

    return (
        <div className="w-full bg-white p-6 rounded-lg border border-gray-300 space-y-6">
            {/* Type of event */}
            <div className="w-full">
                <h2 className="text-xl font-bold mb-2">Type of event</h2>
                <div className="flex space-x-4">
                    <button className="flex-1 py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 ring-blue-500">
                        Single event
                    </button>
                    <button className="flex-1 py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 ring-blue-500">
                        Recurring event
                    </button>
                </div>
            </div>

            {/* Date and time */}
            <div className="w-full">
                <h2 className="text-xl font-bold mb-2">Date and time</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-1">Date</label>
                        <div className="flex items-center border rounded-lg p-2">
                            <i className="fas fa-calendar-alt mr-2"></i>
                            <input type="text" value="11/25/2024" readOnly className="focus:outline-none"/>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1">Start time</label>
                        <div className="flex items-center border rounded-lg p-2">
                            <i className="fas fa-clock mr-2"></i>
                            <input type="text" value="10:00 AM" readOnly className="focus:outline-none"/>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1">End time</label>
                        <div className="flex items-center border rounded-lg p-2">
                            <i className="fas fa-clock mr-2"></i>
                            <input type="text" value="12:00 PM" readOnly className="focus:outline-none"/>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">GMT+7, Display start and end time, English (US)</p>
            </div>

            {/* Location */}
            <div className="w-full">
                <h2 className="text-xl font-bold mb-2">Location</h2>
                <div className="flex space-x-4">
                    <button className="flex-1 py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 ring-blue-500">
                        Venue
                    </button>
                    <button className="flex-1 py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 ring-blue-500">
                        Online event
                    </button>
                    <button className="flex-1 py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 ring-blue-500">
                        To be announced
                    </button>
                </div>

                <div className="mt-4">
                    <div className="flex items-center border rounded-lg p-2">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        <input type="text" placeholder="Location" className="flex-1 focus:outline-none"/>
                    </div>
                </div>

                <div className="mt-4">
                    {/* Toggle Show/Hide Map */}
                    <button
                        onClick={() => setShowMap(!showMap)}
                        className="text-blue-500 underline"
                    >
                        {showMap ? "Hide location details" : "Add location details"}
                    </button>

                    {/* Map Section */}
                    {showMap && (
                        <div className="relative w-full h-64 rounded-md overflow-hidden mt-4">
                            <iframe
                                title="Google Map"
                                className="w-full h-full"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.020366909241!2d-122.42179248468193!3d37.77492967975805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085810d2e2d7001%3A0x5f0ab2079b7fa2a1!2sSan%20Francisco%2C%20CA%2094158%2C%20USA!5e0!3m2!1sen!2s!4v1602208497293!5m2!1sen!2s"
                                allowFullScreen={true}
                                aria-hidden={false}
                                tabIndex={0}
                            ></iframe>
                        </div>
                    )}
                </div>
            </div>

            {/* Reserved seating */}
            <div className="w-full">
                <h2 className="text-xl font-bold mb-2">Reserved seating</h2>
                <p>Use your venue map to set price tiers for each section and choose whether attendees can pick their seat.</p>
            </div>
        </div>
    );
};

const CreateEvent = () => {
    const [showUploadBlock, setShowUploadBlock] = useState(false); // State để quản lý việc hiển thị
    const [showTitleBlock, setShowTitleBlock] = useState(false);
    const [showMap, setShowMap] = useState(true);
    const [showTimeAndMapBlock, setShowTimeAndMapBlock] = useState(false);
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true, // Slide tự động
        autoplaySpeed: 2000,
    };

    return (
        <div className="h-screen flex flex-col space-y-4 p-4">
            {/* Block 1 */}
            <div style={{ width: "60%" , height : "70%"}} className="relative flex-1 rounded-lg flex items-center justify-center border-solid border-4 border-transparent hover:border-blue-800">
                {!showUploadBlock ? (
                    <>
                        {/* Slider với lớp phủ */}
                        <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg z-10"></div>
                        <Slider {...settings} className="w-full h-full rounded-lg overflow-hidden z-0">
                            <div>
                                <img src={event1} alt="Slide 1" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <img src={event2} alt="Slide 2" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <img src={event3} alt="Slide 3" className="w-full h-full object-cover" />
                            </div>
                        </Slider>
                    </>
                ) : (
                    <ImageVideoBlock /> // Hiển thị form khi nhấn Click Me
                )}

                {/* Nút lớn ở giữa */}
                {!showUploadBlock && (
                    <button
                        onClick={() => setShowUploadBlock(true)} // Hiển thị form upload
                        className="z-20 absolute bg-white text-black text-xl font-bold px-6 py-3 rounded-full"
                    >
                        Click Me
                    </button>
                )}

                {/* Nút dấu cộng nhỏ ở góc trên bên phải */}
                <button className="absolute top-2 right-2 z-20 bg-white text-black rounded-full p-2">
                    +
                </button>
            </div>

            {/* Block 2 */}
            <div style={{ width: "60%" , height : "70%"}} className="relative flex-1 rounded-lg flex flex-col items-left justify-center border-solid border-4 border-gray-100 hover:border-blue-800" onClick={() => setShowTitleBlock(true)}>
                {!showTitleBlock ? (
                    <>
                    <h1 className="text-4xl font-bold mb-4">Event Title</h1>
                    <p className ="text-sm text-gray-500 mb-2">A short and sweet sentence about your event</p>
                    <button className="absolute top-2 right-2 z-20 bg-gray-100 text-black rounded-full p-2">
                        +
                    </button>
                    </>
                ) : (
                    <TitleBlock /> // Hiển thị form khi nhấn Click Me
                )}
            </div>

            {/* Block 3 */}
            <div style={{ width: "60%" , height : "150%"}} className="relative flex-1 rounded-lg flex flex-col items-left justify-center border-solid border-4 border-gray-100 hover:border-blue-800" onClick={() => setShowTimeAndMapBlock(true)}>
            {!showTimeAndMapBlock ? (
                    <>
            <div className="flex justify-between mb-4">
                {/* Date and Time Section */}
                <div className="flex-1">
                    <h2 className="text-lg font-bold">Date and time</h2>
                    <div className="flex items-center mt-2">
                        <i className="fas fa-calendar-alt mr-2"></i>
                        <p>Monday, November 25 • 10am - 12pm GMT+7</p>
                    </div>
                </div>

                {/* Location Section */}
                <div className="flex-1">
                    <h2 className="text-lg font-bold">Location</h2>
                    <div className="flex items-center mt-2">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        <p>Enter a location</p>
                    </div>
                </div>

                {/* Add Button */}
                <div className="flex-shrink-0 ml-4">
                    <button className="bg-white border rounded-full p-2">
                        <i className="fas fa-plus"></i>
                    </button>
                </div>
            </div>

            {/* Map Section */}
            {showMap && (
                <div className="relative w-full h-64 rounded-md overflow-hidden mt-4">
                    <iframe
                        title="Google Map"
                        className="w-full h-full"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.020366909241!2d-122.42179248468193!3d37.77492967975805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085810d2e2d7001%3A0x5f0ab2079b7fa2a1!2sSan%20Francisco%2C%20CA%2094158%2C%20USA!5e0!3m2!1sen!2s!4v1602208497293!5m2!1sen!2s"
                        allowFullScreen={true}  // boolean value instead of string
                        aria-hidden={false}     // boolean value instead of string
                        tabIndex={0}            // number value instead of string
                    ></iframe>

                    {/* Toggle Hide/Show Map */}
                    <button
                        onClick={() => setShowMap(!showMap)}
                        className="absolute bottom-2 right-2 bg-white text-black rounded-full px-4 py-1 shadow-md"
                    >
                        {showMap ? "Hide map" : "Show map"}
                    </button>
                </div>
            )}
            </>
                ) : (
                    <EventDateTimeLocation /> // Hiển thị form khi nhấn Click Me
                )}
            </div>
            {/* Block 4 */}
            <div className="flex-1 bg-red-200 rounded-lg flex items-center justify-center">
                Block 4
            </div>
        </div>
    );
};

export default CreateEvent;
