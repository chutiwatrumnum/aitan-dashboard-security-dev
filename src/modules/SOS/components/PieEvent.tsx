import { Pie } from "@ant-design/plots";

const PieEvent = ({ data }) => {
  const configTest = {
    data: data,
    angleField: "total",
    colorField: "nameTH",
    color: ({ nameTH }: any) => {
      const colors = {
        ฉุกเฉิน: "#DC2A31",
        อุปกรณ์มีปัญหา: "#F28F1E",
        อุปกรณ์ออฟไลน์: "#595959",
        Other: "#bfbfbf",
      };
      return colors[nameTH];
    },
    innerRadius: 0.6,
    label: {
      offset: "-50%",
      content: "{value}",
      type: "inner",
      style: { fontFamily: "Prompt", fontWeight: 500 },
    },
    legend: {
      color: {
        title: false,
        position: "center",
        rowPadding: 5,
      },
      position: "right-bottom",
      itemName: {
        style: { fontFamily: "Prompt" },
      },
    },
  };
  return <Pie className="pieEvent" {...configTest} />;
};

export default PieEvent;
