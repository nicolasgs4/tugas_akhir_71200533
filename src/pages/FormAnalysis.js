import { useEffect, useRef, useState } from "react";
import "./../App.css";
import { useNavigate, useParams } from "react-router-dom";
import ValueContent from "../components/ValueContent";
import ResizableTextArea from "../components/ResizableTextArea";
import Select from "react-select";
import { formatISO, parseISO } from "date-fns";
import { list } from "postcss";

export function FormAnalysis() {
  const { id } = useParams();

  const [formDetail, setFormDetail] = useState({});
  const [formValueData, setFormValueData] = useState([]);

  const [publishValues, setPublishValues] = useState();
  const [publishOptions, setPublishOptions] = useState([]);
  const [publishIndex, setPublishIndex] = useState([]);

  const [publishArray, setPublishArray] = useState();

  const hasRendered = useRef(false);

  const navigate = useNavigate();

  const formatDateToIso = (date) => {
    return formatISO(date, { representation: "date" })
      .slice(0, 19)
      .replace("T", " ");
  };

  const defaultbackgroundColor = [
    "#FF4853",
    "#3BC0ED",
    "#03F1A3",
    "#FDEA5F",
    "#FF3136",
    "#0075B6",
    "#11D983",
    "#F4A631",
    "#FF4853",
    "#0098DC",
    "#00E376",
    "#FEC60C",
  ];

  const handleGetPublish = async () => {
    if (publishArray != null) return;
    try {
      const response = await fetch("/publish/" + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      if (res) {
        const options = [];
        console.log(res);
        for (let i = res.length - 1; i >= 0; i--) {
          options.push({
            value: res[i].publish_start,
            label: formatDateToIso(res[i].publish_start),
          });
        }
        setPublishOptions(options);
        setPublishIndex([0]);
        // setPublishArray([res[res.length - 1]]);
        setPublishValues(res.reverse());
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
          setFormValueData([]);
          JSON.parse(res.form_question).forEach((element) => {
            setFormValueData((prev) => [
              ...prev,
              {
                id: element.id,
                name: element.name,
                type: element.type,
                answerElement: element.answerElement,
              },
            ]);
          });
        } else {
          setFormValueData([]);
        }
        return;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error(err);
    }
  };

  //   useEffect(() => {
  //     if (!hasRendered.current) {
  //       hasRendered.current = true;
  //       return;
  //     }
  //     handleGetForm();
  //     handleGetPublish();
  //   }, []);

  useEffect(() => {
    if (!hasRendered.current) {
      handleGetForm();
      handleGetPublish();
      hasRendered.current = true;
    }
  }, []);

  //   useEffect(() => {
  //     if (publishValues != null) {
  //       const newPublishArray = [];
  //       publishIndex.map((element) => {
  //         newPublishArray.push(publishValues[element]);
  //       });
  //       setPublishArray(newPublishArray);
  //     }
  //     console.log(publishIndex);
  //   }, [publishIndex]);

  useEffect(() => {
    if (publishValues != null && publishIndex.length > 0) {
      const newPublishArray = publishIndex.map(
        (element) => publishValues[element]
      );
      setPublishArray(newPublishArray);
    }
  }, [publishIndex, publishValues]); 

  return (
    <div className="h-auto min-h-screen bg-neutral-50 flex justify-center">
      <div className="w-1/2 h-auto flex justify-center">
        <div className="">
          <div
            id={"title"}
            className="w-full pl-5 pr-3 py-3 -translate-y-6 bg-neutral-50 rounded-xl border border-sky-400 flex-row justify-start gap-5 inline-flex relative cursor cursor-pointer select-none items-center"
          >
          
              <button onClick={() => navigate("/analysis")}>
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
            <div>
              <label className="h-fit w-full flex text-black text-2xl font-normal relative flex-wrap">
                <ResizableTextArea
                  type="text"
                  className="w-3/4 bg-neutral-50 pt-4 px-2 flex-wrap overflow-auto"
                  value={formDetail.formTitle}
                  resize="vertical"
                  disabled={true}
                />
                <ResizableTextArea
                  type="text"
                  className="w-3/4 bg-neutral-50 pt-4 px-2 flex-wrap overflow-auto"
                  value={formDetail.formDescription}
                  resize="vertical"
                  disabled={true}
                />
              </label>
            </div>
          </div>
          <div className="w-full relative flex">
            <Select
              options={publishOptions}
              value={publishOptions[publishIndex]}
              onChange={(e) => {
                const newPublishIndex = [];
                e.map((element) => {
                  newPublishIndex.push(publishOptions.indexOf(element));
                });
                setPublishIndex(newPublishIndex);
              }}
              placeholder={"Silahkan pilih tanggal publish"}
              isMulti
              isOptionDisabled={() => publishIndex.length > 5}
              isSearchable={false}
              className="w-full bg-neutral-50 rounded-lg shadow border border-sky-400 justify-stretch items-center"
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderColor: "skyblue",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "#60A5FA"
                    : state.isFocused
                    ? "#60A5FA"
                    : null,
                  color: state.isSelected ? "white" : "black",
                  "&:hover": {
                    backgroundColor: "#60A5FA",
                  },
                }),
                multiValue: (provided, { data, index }) => {
                  const colors = defaultbackgroundColor.slice(
                    0,
                    publishIndex.length
                  );
                  const color = colors[index % colors.length];
                  return {
                    ...provided,
                    backgroundColor: color,
                  };
                },
                multiValueLabel: (provided) => ({
                  ...provided,
                  color: "white",
                }),
                multiValueRemove: (provided) => ({
                  ...provided,
                  color: "white",
                  ":hover": {
                    backgroundColor: "#424A54",
                    color: "white",
                  },
                }),
              }}
            />
          </div>

          {publishArray && formValueData.length > 0 && (
            <ValueContent
              id={id}
              formValueData={formValueData}
              publishArray={publishArray}
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default FormAnalysis;