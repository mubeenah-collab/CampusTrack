import React from "react";

const stages = ["Applied", "Test", "Technical", "HR", "Offer"];

const StatusTimeline = ({ currentStatus }) => {
  const currentIndex = stages.findIndex(
    (stage) => stage.toLowerCase() === currentStatus?.toLowerCase()
  );

  const container = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 15,
    position: "relative",
    height: 70, // FIXED HEIGHT → keeps cards aligned
  };

  const step = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    position: "relative",
  };

  const circle = (active) => ({
    width: 30,
    height: 30,
    borderRadius: "50%",
    backgroundColor: active ? "teal" : "#d1d5db",
    color: active ? "white" : "#555",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    zIndex: 2,
  });

  const label = {
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
    whiteSpace: "nowrap", // prevents text wrapping
    color: "#333",
  };

  const line = (active) => ({
    position: "absolute",
    top: 15,
    left: "50%",
    width: "100%",
    height: 4,
    backgroundColor: active ? "teal" : "#d1d5db",
    zIndex: 1,
  });

  return (
    <div style={container}>
      {stages.map((stage, index) => (
        <div key={stage} style={step}>
          <div style={circle(index <= currentIndex)}>
            {index + 1}
          </div>

          <div style={label}>{stage}</div>

          {index < stages.length - 1 && (
            <div style={line(index < currentIndex)} />
          )}
        </div>
      ))}
    </div>
  );
};

export default StatusTimeline;