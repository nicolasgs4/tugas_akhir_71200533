import "./../App.css";
import { getQuestionTypeValue } from "../data/QuestionData";
import { useEffect, useRef, useState } from "react";
import ResizableTextArea from "./ResizableTextArea";

function QuestionContainer({
  sectionIndex,
  question,
  index,
  handleChange,
  handleDelete,
  focusIndex,
  handleFocus,
  isDisabled,
}) {
  const activeIndex = getQuestionTypeValue(question.type);

  const [toggleArr, setToggleArr] = useState();
  const [othersAdded, setOthersAdded] = useState(false); 


  const addToggleElement = (value, index) => {
    const newToggleArr = [...toggleArr];

    if (index === 0) {
      newToggleArr[0] = value;
    }
    if (index === 1) {
      if (toggleArr.length <= 0) newToggleArr[0] = "";
      newToggleArr[1] = value;
    }

    setToggleArr(newToggleArr);
  };

  const textAreaSplitter = (value) => {
    const combinedValue = value.split("\n");
    var answerElementItem = [];
    combinedValue.map(
      (element, elementIndex) =>
        (answerElementItem = [...answerElementItem, (elementIndex = element)])
    );
    if (answerElementItem <= 0 && answerElementItem == "")
      answerElementItem = null;
    return answerElementItem;
  };

  const scaleElement = () => {
    var scaleElementItem = [];
    for (var i = 0; i < question["setting"]["scaleSize"] * 2 + 3; i++) {
      const j = i;
      scaleElementItem = [
        ...scaleElementItem,
        <button
          key={"circle" + i}
          checked={question["value"] == i}
          onClick={() => handleChange("value", j, index)}
          disabled={isDisabled.fill}
          style={{ margin: "5px" }}
        >
          {question["value"] >= i && typeof question["value"] == "number" ? (
            <svg
              width="25"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="25" cy="25" r="23.5" stroke="black" strokeWidth="3" />
              <circle
                cx="25"
                cy="25"
                r="18.5"
                fill="black"
                style={{ margin: "10px" }}
              />
            </svg>
          ) : (
            <svg
              width="25"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="25" cy="25" r="23.5" stroke="black" strokeWidth="3" />
            </svg>
          )}
        </button>,
      ];
    }
    return scaleElementItem;
  };

  const [multiValue, setMultiValue] = useState([]);
  const [onEdit, setOnEdit] = useState(false);

  const hasRendered = useRef(false);

  useEffect(() => {
    setToggleArr(
      question["answerElement"] === null ? [] : question["answerElement"]
    );
  }, []);

  useEffect(() => {
    if (toggleArr !== null && toggleArr !== undefined && toggleArr.length > 0) {
      console.log(toggleArr);
      handleChange("answerElement", toggleArr, index);
    }
  }, [toggleArr]);

  useEffect(() => {
    multiValue.sort((a, b) => a - b);
    handleChange("value", multiValue, index);
  }, [multiValue]);

  return (
    <div className="w-full ">
      {activeIndex == 0 ? (
        <div className="flex flex-wrap">
          <div className="h-16 bg-sky-400 text-neutral-50 p-2 rounded-xl">
            Halaman {sectionIndex}
          </div>
        </div>
      ) : null}

      <div
        id={"question" + index}
        key={index}
        tabIndex="0"
        onClick={() => handleFocus(index)}
        className={`w-full -translate-y-6 pl-5 pr-3 py-3 bg-neutral-50 rounded-xl border border-sky-400 flex-col justify-start items-start gap-5 inline-flex relative cursor cursor-pointer select-none ${
          focusIndex == index
            ? "border-l-4 border-r border-t-8 border-b border-sky-400"
            : ""
        }`}
      >
        <label className="h-fit w-full flex text-black text-2xl font-normal relative flex-wrap">
          {question.type == "section" ? null : (
            <a className="mt-4">{index + 1 + ". "}</a>
          )}
          <ResizableTextArea
            disabled={isDisabled.edit}
            type="text"
            className="w-3/4 bg-neutral-50 pt-4 px-2 flex-wrap overflow-auto"
            value={question.name}
            onChange={(e) => handleChange("name", e.target.value, index)}
            resize="vertical"
          />
          <a
            hidden={!question.isRequired}
            className="text-red-500 absolute rigth-[12px]"
          >
            *
          </a>
        </label>
        {!isDisabled.edit ? (
          <button
            className="absolute right-0 mr-3"
            onClick={(event) => handleDelete(event, index)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.89432 16C1.89432 17.1 2.79676 18 3.89975 18H11.9215C13.0245 18 13.9269 17.1 13.9269 16V4H1.89432V16ZM14.9296 1H11.4201L10.4174 0H5.40383L4.40111 1H0.891602V3H14.9296V1Z"
                fill="black"
              />
            </svg>
          </button>
        ) : null}
        {activeIndex === 1 && (
          <div className="w-full h-fit">
            <ResizableTextArea
              className="md:w-3/4 sm:w-full min-h-6 bg-neutral-50 rounded-xl border border-black overflow-auto p-4 text-2xl flex-wrap "
              onChange={(e) => handleChange("value", e.target.value, index)}
              placeholder={"Silahkan Jawab di sini"}
              question={question}
              index={index}
              value={question.value || ""}
              maxLength={question.setting.maxChar}
              resize={"vertical"}
              disabled={isDisabled.fill}
            />
          </div>
        )}
        {activeIndex === 2 && (
          <div className="relative pr-5">
            <label style={{ marginRight: "20px" }}>
              <input
                type="radio"
                checked={question.value[0] === 0}
                onChange={(e) => handleChange("value", [0], index)}
                disabled={isDisabled.fill}
              />
              <input
                type="text"
                value={
                  question["answerElement"] === null
                    ? ""
                    : question["answerElement"][0]
                }
                onChange={(e) => addToggleElement(e.target.value, 0)}
                placeholder="Masukan pilihan pertama"
                disabled={isDisabled.edit}
              />
            </label>
            <label>
              <input
                type="radio"
                checked={question.value[0] === 1}
                onChange={(e) => handleChange("value", [1], index)}
                disabled={isDisabled.fill}
              />
              <input
                type="text"
                value={
                  question["answerElement"] === null
                    ? ""
                    : question["answerElement"][1]
                }
                onChange={(e) => addToggleElement(e.target.value, 1)}
                placeholder="Masukan pilihan kedua"
                disabled={isDisabled.edit}
              />
            </label>
          </div>
        )}

  {activeIndex === 3 && (
      <div className="w-3/4">
        {onEdit ? (
          <div>
            <ResizableTextArea
              className="w-full rounded-[10px] border border-black overflow-auto p-4 text-2xl flex-wrap"
              defaultValue={
                question["answerElement"] != null
                  ? question["answerElement"].join("\n")
                  : ""
              }
              onBlur={(e) => {
                handleChange(
                  "answerElement",
                  textAreaSplitter(e.target.value),
                  index
                );
                setOnEdit(false);
                setMultiValue([]);
              }}
              autoFocus={true}
              resize={"vertical"}
              disabled={isDisabled.edit}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {question["answerElement"] != null &&
              question["answerElement"].map((element, elementIndex) => (
                <div key={"multi" + elementIndex} className="flex items-center justify-between">
                  <input
                    type="checkbox"
                    checked={question.value.includes(elementIndex)}
                    onChange={(e) => {
                      if (!isDisabled.fill) {
                        const newValues = e.target.checked
                          ? [...question.value, elementIndex]
                          : question.value.filter(value => value !== elementIndex);
                        handleChange("value", newValues, index);
                      }
                    }}
                    disabled={isDisabled.fill}
                    className="mr-2"
                  />
                  <input
                    type="text"
                    value={element}
                    onChange={(e) => {
                      if (!isDisabled.edit) {
                        const newElements = [...question["answerElement"]];
                        newElements[elementIndex] = e.target.value;
                        handleChange("answerElement", newElements, index);
                      }
                    }}
                    className="border border-gray-300 rounded p-2 w-4/5"
                    disabled={isDisabled.edit}
                  />
                  {!isDisabled.edit && (
                    <button
                      onClick={() => {
                        const newElements = question["answerElement"].filter((_, i) => i !== elementIndex);
                        handleChange("answerElement", newElements, index);
                      }}
                      className="text-red-500 ml-2"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))}
            {!isDisabled.edit && (
              <div>
                <button
                  onClick={() => {
                    const newElements = [...(question["answerElement"] || []), ""];
                    handleChange("answerElement", newElements, index);
                  }}
                  className="flex items-center gap-2 mt-2 bg-blue-500 text-white p-2 rounded"
                >
                  Tambah Pilihan
                </button>
                {!othersAdded && ( 
                  <button
                    onClick={() => {
                      const newElements = [...(question["answerElement"] || []), "Others"];
                      handleChange("answerElement", newElements, index);
                      setOthersAdded(true); 
                    }}
                    className="mt-2 bg-green-500 text-white p-2 rounded"
                  >
                    Tambah Others
                  </button>
                )}
              
            </div>
          )}
        </div>
      )}
    </div>
  )}




        {activeIndex === 4 && <div></div>}

        {activeIndex === 5 && (
          <div className="relative">
            {scaleElement()}
            <div className="flex justify-between mb-4">
              <input
                placeholder="Masukkan Nilai Skala"
                type="text"
                disabled={isDisabled.edit}
                value={question["setting"]["minInfo"]}
                onChange={(e) =>
                  handleChange("setting.minInfo", e.target.value, index)
                }
                className="flex-1 mr-2"
              ></input>
              <input
                placeholder="Masukkan Nilai Skala"
                type="text"
                disabled={isDisabled.edit}
                value={question["setting"]["maxInfo"]}
                onChange={(e) =>
                  handleChange("setting.maxInfo", e.target.value, index)
                }
                className="flex-1 ml-2"
              ></input>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default QuestionContainer;