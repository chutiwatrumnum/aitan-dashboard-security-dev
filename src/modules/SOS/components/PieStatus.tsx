import { Pie } from "@ant-design/plots";

const PieStatus = ({ data }) => {
  const configTest = {
    data: data,
    angleField: "total",
    colorField: "status",
    color: ({ status }: any) => {
      const colors = {
        "Armed Away": "#01A171",
        "Armed Stay": "#3C8BF1",
        Disarmed: "#DC2A31",
        Other: "#bfbfbf",
      };
      return colors[status];
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
  return <Pie className="pieStatus" {...configTest} />;
};

export default PieStatus;
