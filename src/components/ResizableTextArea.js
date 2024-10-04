import { useEffect, useRef, useState } from "react";

function ResizableTextArea(props) {
    const textAreaRef = useRef(null);

    const autoResizeTextarea = () => {
        switch (props.resize) {
            case "horizontal":
                textAreaRef.current.style.width = "auto";
                textAreaRef.current.className += " whitespace-nowrap"
                textAreaRef.current.style.width = textAreaRef.current.scrollWidth + "px";
                break;
            case "vertical":
                textAreaRef.current.style.height = "auto";
                textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
                break;
            case "both":
                textAreaRef.current.style.height = "auto";
                textAreaRef.current.className += " whitespace-nowrap";
                textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
                textAreaRef.current.style.width = "auto";
                textAreaRef.current.style.width = textAreaRef.current.scrollWidth + "px";
        }
    };

    useEffect(() => {
        autoResizeTextarea();
    }, [])



    return (
        <textarea
            className={props.className + 'w-full p-1 bg-neutral-50 active:outline-none focus:outline-none rounded resize-none'}
            placeholder={props.placeholder || ''}
            value={props.value}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
            onBlur={props.onBlur}
            autoFocus={props.autoFocus}
            rows="1"
            maxLength={props.maxLength}
            ref={textAreaRef}
            disabled={props.disabled}
            style={{ overflow: 'hidden' }}
        />
    );
} export default ResizableTextArea;