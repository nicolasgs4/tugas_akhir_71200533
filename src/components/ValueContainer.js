import "./../App.css";
import { getQuestionTypeValue } from "../data/QuestionData";
import { useEffect, useRef, useState } from "react";
import ResizableTextArea from "./ResizableTextArea";
import randomColor from "randomcolor";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, getElementAtEvent } from "react-chartjs-2";

export default function ValueContainer({ id, index, question, publishArray }) {
  const activeIndex = getQuestionTypeValue(question.type);
  const [valueData, setValueData] = useState(null);
  const chartRef = useRef();

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

  const hasRendered = useRef(false);

  const HandleGetFormValue = async () => {
    try {
      let publishArrayString = "";
      publishArray.map((element, index) => {
        publishArrayString += "&publish_start[]=" + element.publish_start;
        publishArrayString += "&publish_end[]=" + element.publish_end;
      });
      const response = await fetch(
        "/value/" + id + "?index=" + index + publishArrayString,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await response.json();
      if (res) {
        console.log(res);
        if (activeIndex === 0) return;
        if (activeIndex === 1) {
          setValueData([]);
          res.map((element) => {
            setValueData((prev) => [...prev, Object.values(element)]);
          });
        } else {
          if (valueData) chartRef.current.reset();
          const datasets = [];
  
          res.map((element, index) => {
            datasets.push({
              label: `Dataset ${index + 1}`, 
              data: Object.values(element),
              backgroundColor: defaultbackgroundColor[index],
              borderWidth: 0,
            });
          });
  
          setValueData({
            labels: res.length > 0 ? Object.keys(res[0]) : [], 
            datasets: datasets, 
          });
        }
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
    HandleGetFormValue();
    console.log(valueData);
  }, [publishArray]);

  Chart.register(
    ArcElement,
    BarElement,
    Tooltip,
    CategoryScale,
    LinearScale,
    Title,
    PointElement,
    LineElement,
    TimeScale,
    Filler
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          callback: function (value, index, ticks) {
            const label = this.getLabelForValue(value);
            const numericLabel = Number(label);
            if (!isNaN(numericLabel)) {
              return numericLabel + 1; 
            }
            return label.length > 10 ? label.substring(0, 10) + "..." : label;
          },
          maxRotation: 0,
          autoSkip: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function (context) {
            return context[0].label;
          },
          label: function (context) {
            return `Value: ${context.parsed.y}`;
          },
        },
      },
      legend: {
        display: false, 
      },
    },
  };
  

  return (
    <div className="w-full h-wrap">
      {activeIndex === 0 && (
        <div className="flex flex-wrap translate-y-6">
          <div className="h-16 bg-sky-400 text-neutral-50 p-2 rounded-xl">
            Judul Kuesioner
          </div>
        </div>
      )}
      <div
        id={"question" + index}
        key={index}
        tabIndex="0"
        className={`w-full pl-5 pr-3 bg-neutral-50 rounded-xl border border-sky-400 
        justify-start items-start flex flex-wrap relative cursor-pointer select-none 
        ${activeIndex === 0 ? "" : "h-[450px]"}`}
      >
        <label className="h-fit w-full flex text-black text-2xl font-normal relative flex-wrap">
          {question.type === "section" ? null : (
            <a className="mt-4">{index + 1 + ". "}</a>
          )}
          <ResizableTextArea
            disabled={true}
            type="text"
            className="w-3/4 bg-neutral-50 pt-4 px-2 overflow-auto"
            style={{ maxHeight: "100px" }}
            value={question.name}
            resize="vertical"
          />
        </label>
        <div className="w-full h-[10rem] mt-[-10rem]">
          {activeIndex === 1 && (
            <div className="w-full overflow-hidden">
              <div className="flex space-x-4 justify-between overflow-hidden">
                {valueData != null &&
                  valueData.map((element, index) => (
                    <ul
                      key={index}
                      className="list-none space-y-4 overflow-y-auto max-h-[20rem]"
                      style={{ width: "calc(33.33% - 1rem)" }}
                    >
                      {element.map((item, itemIndex) => {
                        if (typeof item === "string" && item.trim() !== "") {
                          return (
                            <li
                              key={itemIndex}
                              tabIndex="0"
                              className="h-auto p-2.5 bg-[#fcfcfc] rounded-[10px] justify-center items-center gap-2.5 flex"
                              style={{
                                border: `2px solid ${
                                  defaultbackgroundColor[
                                    index % defaultbackgroundColor.length
                                  ]
                                }`,
                              }}
                            >
                              <div className="text-black text-sm font-normal font-['Montserrat'] text-center">
                                {itemIndex + 1 + element.length * index}. {item}
                              </div>
                            </li>
                          );
                        }
                        return null;
                      })}
                    </ul>
                  ))}
              </div>
            </div>
          )}
          <div className="w-full h-[10rem] flex">
            {activeIndex > 1 && valueData && (
              <div className="w-full">
                <Bar
                  ref={chartRef}
                  data={valueData}
                  options={options}
                  onClick={(e) => {
                    console.log(getElementAtEvent(chartRef.current, e));
                  }}
                />
              </div>
            )}
          </div>
          <div className="w-full flex flex-col mt-4">
            {valueData?.datasets?.map((dataset, idx) => (
              <div key={idx} className="flex items-center mt-2">
                <div
                  className="w-4 h-4 mr-2"
                  style={{ backgroundColor: dataset.backgroundColor }}
                ></div>
                <span className="font-semibold text-sm">{dataset.label}</span>
                <span className="text-xs ml-4 text-gray-600">
                  {`Jumlah data: ${dataset.data.reduce((a, b) => a + b, 0)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
