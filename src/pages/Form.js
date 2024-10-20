import { useEffect, useRef, useState } from "react";

import "./../App.css";
import QuestionInspector from "../components/QuestionInspector";
import QuestionContent from "../components/QuestionContent";
import QuestionList from "../components/QuestionList";
import { useNavigate, useParams } from "react-router-dom";
import myData from "./../output.json";
import { useCookies } from "react-cookie";
import End from "./End";

export function Form() {
  const { id } = useParams();
  const cookie = useCookies(["skripsi-form"]);
  const navigate = useNavigate();
  const [formDetail, setFormDetail] = useState([]);
  const [formJson, setFormJson] = useState([]);
  const hasRendered = useRef(false);
  const allowChange = useRef(false);
  const [focusIndex, setFocusIndex] = useState(null);
  if (focusIndex < 0) setFocusIndex(null);

  const [isDisabled, setIsDisabled] = useState({ edit: false, fill: false });

  const handleLoad = async (data) => {
    try {
      const response = await fetch("/main", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();

      if (res) {
        setIsDisabled((prev) => ({ ...prev, edit: false, fill: true }));
        return;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetForm = async () => {
    try {
      const response = await fetch("/form/" + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      if (res) {
        setFormDetail({
          formTitle: res.form_title,
          formDescription: res.form_description,
        });
        if (res.form_question != null) {
          JSON.parse(res.form_question);
          setFormJson(JSON.parse(res.form_question));
        } else {
          setFormJson([]);
        }
        allowChange.current = true;
        return;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuestionsChange = async () => {
    if (!allowChange.current) return;
    try {
      const response = await fetch("/form/" + id + "?edit=question", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formJson: formJson }),
      });
      const res = await response.json();

      if (res) {
        return;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormChange = async () => {
    if (!allowChange.current) return;
    try {
      const response = await fetch("/form/" + id + "?edit=detail", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formTitle: formDetail.formTitle,
          formDescription: formDetail.formDescription,
        }),
      });
      const res = await response.json();

      if (res) {
        return;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostValues = async () => {
    if (!allowChange.current) return;
    const combinedValues = [];
    formJson.forEach((element) => {
      combinedValues.push({
        id: element.id,
        value: element.value,
        type: element.type,
      });
      element.value = [];
    });
    try {
      const response = await fetch("/form/" + id + "/fill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: combinedValues }),
      });
      const res = await response.json();

      if (res) {
        return;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!hasRendered.current) {
      hasRendered.current = true;
      return;
    }
    if (cookie[0]["skripsi-form"])
      handleLoad({ token: cookie[0]["skripsi-form"] });
    else setIsDisabled((prev) => ({ ...prev, edit: true, fill: false }));
    handleGetForm();
    console.log(isDisabled);
  }, []);

  useEffect(() => {
    if (!hasRendered.current) {
      hasRendered.current = true;
      return;
    }
    handleFormChange();
  }, [formDetail]);

  useEffect(() => {
    if (!hasRendered.current) {
      hasRendered.current = true;
      return;
    }
    if (formJson.length < 0) return;
    console.log(formJson);
    handleQuestionsChange();
  }, [formJson]);

  const handleChange = (key, value, index) => {
    const keyJson = key.split(".");
    const count = keyJson.length;
    setFormJson((prev) => {
      var updatedFormJson = [...prev];

      if (count > 1) {
        var element = updatedFormJson[index];
        keyJson.map((keyJson, i) =>
          i < count - 1
            ? (element = element[keyJson])
            : (element = {
                ...element,
                [keyJson]: value,
              })
        );
        updatedFormJson[index][keyJson[0]] = element;
      } else {
        updatedFormJson[index] = {
          ...updatedFormJson[index],
          [keyJson]: value,
        };
      }
      return updatedFormJson;
    });
  };

  const handleDetailChange = (detail, value) => {
    setFormDetail((prevState) => ({
      ...prevState,
      [detail]: value,
    }));
  };

  const handleFocus = (index) => {
    setFocusIndex(index);
  };

  document.addEventListener("mousedown", () => {
    if (isDisabled.edit && isDisabled.fill) {
      setIsDisabled({ edit: false, fill: true });
      setFocusIndex(null);
    }
  });

  return (
    <div className="w-screen h-auto min-h-screen bg-neutral-50 ">
      <div className="flex flex-wrap">
        <div className="md:w-1/4 sm:w-0 flex justify-start">
          {!isDisabled.edit && isDisabled.fill ? (
            <QuestionList
              formTitle={formDetail.formTitle}
              formJson={formJson}
              setFormJson={setFormJson}
              focusIndex={focusIndex}
            ></QuestionList>
          ) : null}
        </div>
        <div className="md:w-1/2 sm:w-full">
          <div className="h-[76px] px-10 py-[15px] bg-neutral-50 border border-blue-400 justify-start items-center gap-2.5 flex">
            {!isDisabled.edit && (
              <button onClick={() => navigate("/create")}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="ep:back">
                    <path
                      id="Vector"
                      d="M8.75 18.75H33.75C34.0815 18.75 34.3995 18.8817 34.6339 19.1161C34.8683 19.3505 35 19.6685 35 20C35 20.3315 34.8683 20.6495 34.6339 20.8839C34.3995 21.1183 34.0815 21.25 33.75 21.25H8.75C8.41848 21.25 8.10054 21.1183 7.86612 20.8839C7.6317 20.6495 7.5 20.3315 7.5 20C7.5 19.6685 7.6317 19.3505 7.86612 19.1161C8.10054 18.8817 8.41848 18.75 8.75 18.75Z"
                      fill="#32A3DF"
                    />
                    <path
                      id="Vector_2"
                      d="M9.26583 20L19.6333 30.365C19.868 30.5997 19.9999 30.9181 19.9999 31.25C19.9999 31.5819 19.868 31.9003 19.6333 32.135C19.3986 32.3697 19.0803 32.5016 18.7483 32.5016C18.4164 32.5016 18.098 32.3697 17.8633 32.135L6.61333 20.885C6.49692 20.7689 6.40456 20.6309 6.34155 20.4791C6.27853 20.3272 6.24609 20.1644 6.24609 20C6.24609 19.8356 6.27853 19.6728 6.34155 19.5209C6.40456 19.369 6.49692 19.2311 6.61333 19.115L17.8633 7.86499C18.098 7.63028 18.4164 7.49841 18.7483 7.49841C19.0803 7.49841 19.3986 7.63028 19.6333 7.86499C19.868 8.09971 19.9999 8.41805 19.9999 8.74999C19.9999 9.08193 19.868 9.40028 19.6333 9.63499L9.26583 20Z"
                      fill="#32A3DF"
                    />
                  </g>
                </svg>
              </button>
            )}
            <div className="text-sky-400 text-2xl font-black font-['Montserrat']">
              Pembuatan Kuesioner
            </div>
          </div>
          <div>
            {/* <button onClick={() => handlePostValues()}>Click</button> */}
            <QuestionContent
              formDetail={formDetail}
              formJson={formJson}
              setFormJson={setFormJson}
              focusIndex={focusIndex}
              setFocusIndex={setFocusIndex}
              handleDetailChange={handleDetailChange}
              handleChange={handleChange}
              handleFocus={handleFocus}
              isDisabled={isDisabled}
            />
            {isDisabled.edit && !isDisabled.fill ? (
              <div className="flex flex-wrap">
                <div
                  className="ml-8 bg-sky-400 text-neutral-50 p-2 rounded-xl"
                  onClick={() => {
                    handlePostValues();
                    navigate("/End");
                  }}
                >
                  SUBMIT
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="md:w-1/4 sm:w-0 flex justify-end overflow-y-auto">
          {!isDisabled.edit && isDisabled.fill ? (
            <QuestionInspector
              formJson={formJson}
              focusIndex={focusIndex}
              handleChange={handleChange}
              setIsDisabled={setIsDisabled}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
export default Form;