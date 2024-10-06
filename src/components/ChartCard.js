import { ArcElement, Chart, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./../App.css";
import { getElementAtEvent, Pie } from "react-chartjs-2";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import randomColor from "randomcolor";
import { ChromePicker } from "react-color";
import { useCookies } from "react-cookie";

const ChartCard = ({ valueData }) => {
  const [form, setForm] = useState({
    form_id: null,
    value_id: null,
    question_type: null,
  });
  const [data, setData] = useState();
  const chartRef = useRef();
  const titleOptions = useRef([]);
  const questionOptions = useRef([]);
  const questionSelect = useRef();
  const [colorSelected, setColorSelected] = useState();
  const elementIndex = useRef();
  const clickPos = useRef();
  const [cookie, setCookie, removeCookie] = useCookies(["cookies-n-cream"]);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

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

  const handleClick = (color) => {
    setDisplayColorPicker(true);
    setColorSelected(color);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
    setColorSelected();
  };

  const handleChangeComplete = (color, e) => {
    setColorSelected(color.hex);
    const colorSet = data.datasets[0].backgroundColor;
    colorSet[elementIndex.current] = color.hex;

    setData((prev) => ({
      ...prev,
      datasets: [
        {
          ...prev.datasets[0],
          backgroundColor: colorSet,
        },
      ],
    }));
  };

  const handleGetFormValue = async () => {
    try {
      const response = await fetch(
        `/value/${form.form_id}?index=${form.value_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await response.json();
      if (res && res.length > 0) {
        const labels = Object.keys(res[0]);
        const filteredValues = Object.values(res[0]).filter(
          (value) => value !== 0
        );
        const filteredLabels = labels.filter(
          (_, index) => Object.values(res[0])[index] !== 0
        );

        const randomizedColor = filteredLabels.map(() => randomColor());

        setData({
          labels: filteredLabels,
          datasets: [
            {
              label: "Jumlah",
              data: filteredValues,
              backgroundColor: defaultbackgroundColor.slice(
                0,
                filteredLabels.length
              ),
              borderWidth: 0,
            },
          ],
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyChart = () => {
    const canvas = chartRef.current.canvas;
    if (canvas) {
      canvas.toBlob((blob) => {
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]);
      });
    }
  };

  useEffect(() => {
    titleOptions.current = Object.entries(valueData).map(([key, value]) => ({
      value: key,
      label: value.form_title,
    }));
  }, []);

  useEffect(() => {
    if (form.form_id && form.value_id) handleGetFormValue();
  }, [form]);

  useEffect(() => {
    if (data) chartRef.current.getDatasetMeta(0).data[0].hidden = false;
  }, [data]);

  Chart.register(ArcElement, Tooltip);
  Chart.defaults.set("plugins.datalabels", { color: "#000000" });

  return (
    <div className="p-4 mb-[1.5rem] bg-neutral-50 rounded-[15px] border border-neutral-500 flex-col items-center gap-4 flex min-h-[30rem] h-auto">
      <h2 className="text-lg font-semibold text-center text-gray-700">
        Chart Pilihan Pertanyaan
      </h2>
      <div className="w-full">
        <Select
          placeholder="Pilih Kuesioner yang ingin dilihat"
          options={titleOptions.current}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, form_id: e.value, value_id: null }));
            questionOptions.current = Object.entries(
              valueData[e.value].question_type
            )
              .filter(
                ([key, value]) =>
                  value.type !== "section" && value.type !== "text"
              )
              .map(([key, value]) => ({
                value: key,
                label: value.name,
              }));
          }}
        />
      </div>
      <div className="w-full">
        <Select
          ref={questionSelect}
          options={questionOptions.current}
          placeholder="Pilih Pertanyaan yang ingin dilihat"
          onChange={(e) => {
            setForm((prev) => ({
              ...prev,
              value_id: e.value,
              question_type: valueData[form.form_id].question_type[e.value],
            }));
          }}
        />
      </div>
      <div className="relative flex flex-col items-center">
        <div className="w-[250px]">
          {data && (
            <Pie
              ref={chartRef}
              data={data}
              plugins={[ChartDataLabels]}
              onClick={(e) => {
                if (getElementAtEvent(chartRef.current, e).length > 0) {
                  handleClick(
                    getElementAtEvent(chartRef.current, e)[0].element.options
                      .backgroundColor
                  );
                  elementIndex.current = getElementAtEvent(
                    chartRef.current,
                    e
                  )[0].index;
                  clickPos.current = { x: e.pageX + "px", y: e.pageY + "px" };
                }
              }}
            />
          )}
        </div>
        {data && (
          <div className="flex flex-col p-4 bg-gray-100 rounded-lg shadow-md mt-4 w-full">
            <ul>
              {data.labels.map((element, index) => (
                <li key={index} className="flex items-center gap-2 mb-2">
                  <button
                    className="w-5 h-5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: data.datasets[0].backgroundColor[index],
                    }}
                    onClick={(e) => {
                      clickPos.current = {
                        x: e.pageX + "px",
                        y: e.pageY + "px",
                      };
                      elementIndex.current = index;
                      handleClick(data.datasets[0].backgroundColor[index]);
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {element}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data != null && (
          <button className="absolute right-0" onClick={handleCopyChart}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#0075b6"
            >
              <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
            </svg>
          </button>
        )}
      </div>

      {displayColorPicker && (
        <div
          className="absolute z-10"
          style={{ left: clickPos.current.x, top: clickPos.current.y }}
        >
          <div className="fixed inset-0" onClick={handleClose} />
          <ChromePicker color={colorSelected} onChange={handleChangeComplete} />
        </div>
      )}
    </div>
  );
};

export default ChartCard;