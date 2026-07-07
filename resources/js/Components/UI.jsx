import React from "react";

/** Section heading, e.g. "Description", "Circuit Diagram", "Code" */
export function Section({ title, children }) {
    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                {title}
            </h3>
            {children}
        </div>
    );
}

/** Plain paragraph text */
export function Paragraph({ children }) {
    return (
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {children}
        </p>
    );
}

/** Image + optional caption, consistent frame across all datasheets */
export function Figure({ src, alt = "", caption }) {
    return (
        <figure className="flex flex-col items-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 w-full flex justify-center">
                <img
                    src={src}
                    alt={alt}
                    className="max-h-96 object-contain"
                    onError={(e) => {
                        e.target.style.display = "none";
                    }}
                />
            </div>
            {caption && (
                <figcaption className="mt-2 text-sm text-gray-500 text-center">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}

/** Monospace pill list, e.g. PlatformIO / Arduino library dependencies */
export function LibraryList({ title, items = [] }) {
    return (
        <div>
            {title && <p className="text-gray-700 font-medium mb-2">{title}</p>}
            <ul className="flex flex-wrap gap-2">
                {items.map((item, i) => (
                    <li
                        key={i}
                        className="font-mono text-sm bg-gray-100 rounded px-3 py-1.5 text-gray-800"
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

/** Blue callout for tips / expected results */
export function Note({ children }) {
    return (
        <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg px-4 py-3">
            <p className="text-sm text-blue-800">{children}</p>
        </div>
    );
}