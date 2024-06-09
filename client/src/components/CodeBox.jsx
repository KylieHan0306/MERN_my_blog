import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBox = ({ code, language }) => {
    const [copied, setCopied] = useState(false);
    const [codeString, setCodeString] = useState(code.toString());
    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };
    console.log(code);
    useEffect(() => {
        setCodeString(code.toString().replace('\\n'.toString(), '\n'));
    }, [code])

    return (
        <div className="relative mb-4">
            <CopyToClipboard text={code} onCopy={handleCopy}>
                <div
                    size="sm"
                    className="
                        absolute 
                        top-1
                        right-2.5 
                        z-10 
                        text-white 
                        border-none 
                        p-2.5 
                        cursor-pointer 
                        bg-none"
                >
                    {copied ? 'Copied!' : 'Copy code'}
                </div>
            </CopyToClipboard>
            <SyntaxHighlighter language={language} style={coldarkDark} className="rounded-lg min-h-4" id="codeBox">
                {codeString}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBox;