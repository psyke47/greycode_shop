import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

/**
 * Shared code block with a copy button. Used inside individual
 * datasheet components (DHT22Datasheet, MPU6050Datasheet, etc.)
 * so styling stays consistent without repeating markup everywhere.
 */
export default function CodeBlock({ language = "code", code = "" }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Copy failed:", err);
        }
    };

    return (
        <div className="relative rounded-lg overflow-hidden border border-gray-800">
            <div className="flex items-center justify-between bg-greycode-dark-blue px-4 py-2">
                <span className="text-xs font-mono text-gray-300 uppercase">
                    {language}
                </span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-gray-300 hover:text-white transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5" /> Copied
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" /> Copy
                        </>
                    )}
                </button>
            </div>
            <pre className="bg-black text-gray-100 text-sm p-4 overflow-x-auto">
                <code>{code}</code>
            </pre>
        </div>
    );
}