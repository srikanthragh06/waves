import UsernameLink from "../components/UsernameLink";

function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
        return "th";
    }

    const lastDigit = day % 10;
    switch (lastDigit) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

export function formatDate(dateString) {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const date = new Date(dateString);
    const day = date.getDate();
    const formattedDate = date.toLocaleDateString("en-US", options);

    const suffix = getDaySuffix(day);

    return `${formattedDate.replace(/\b\d+\b/, day + suffix)}`.replace(",", "");
}

export function formatDate2(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based, so we add 1
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num;
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getFileType = (fileName) => {
    if (!fileName) return null;

    const lowerCaseFileName = fileName.toLowerCase();

    if (
        lowerCaseFileName.endsWith(".jpeg") ||
        lowerCaseFileName.endsWith(".jpg") ||
        lowerCaseFileName.endsWith(".png")
    ) {
        return "image";
    } else if (
        lowerCaseFileName.endsWith(".avi") ||
        lowerCaseFileName.endsWith(".mp4") ||
        lowerCaseFileName.endsWith(".mkv")
    ) {
        return "video";
    } else {
        return null;
    }
};

export const usernamifyContent = (content) => {
    const contents = content.split(" ").map((word, index) => {
        if (word[0] === "@") {
            return <UsernameLink key={index}>{word} </UsernameLink>;
        } else {
            return <span key={index}>{word} </span>;
        }
    });
    return contents;
};

export const formatTimestamp = (timestamp) => {
    const formattedDate = new Date(timestamp).toLocaleString();
    return formattedDate;
};

export const isEmail = (usermail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(usermail)) return true;
    else return false;
};
