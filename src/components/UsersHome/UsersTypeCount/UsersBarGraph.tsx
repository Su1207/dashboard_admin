// import React, { useEffect, useRef } from "react";
// import { Bar } from "react-chartjs-2";

// const UsersBarGraph = ({
//   activeUsers = [],
//   blockedUsers = [],
//   todayRegistered = [],
//   liveUsers = [],
//   last24 = [],
//   zeroBalanceUsers = [],
//   deadUsers = [],
// }) => {
//   const chartContainer = useRef(null);

//   useEffect(() => {
//     const chartCanvas = chartContainer.current;
//     const chartContext = chartCanvas?.getContex("2d");

//     if (!chartCanvas || !chartContext) {
//       return;
//     }

//     const chartData = {
//       labels: [
//         "Active Users",
//         "Blocked Users",
//         "Today Registered",
//         "Live Users",
//         "24 hours Live",
//         "0 Balance Users",
//         "Dead Users",
//       ],
//       datasets: [
//         {
//           label: "Users",
//           data: [
//             activeUsers.length,
//             blockedUsers.length,
//             todayRegistered.length,
//             liveUsers.length,
//             last24.length,
//             zeroBalanceUsers.length,
//             deadUsers.length,
//           ],
//           backgroundColor: [
//             "rgba(255, 99, 132, 0.2)",
//             "rgba(54, 162, 235, 0.2)",
//             "rgba(255, 206, 86, 0.2)",
//             "rgba(75, 192, 192, 0.2)",
//             "rgba(153, 102, 255, 0.2)",
//             "rgba(255, 159, 64, 0.2)",
//             "rgba(255, 99, 132, 0.2)",
//           ],
//           borderColor: [
//             "rgba(255, 99, 132, 1)",
//             "rgba(54, 162, 235, 1)",
//             "rgba(255, 206, 86, 1)",
//             "rgba(75, 192, 192, 1)",
//             "rgba(153, 102, 255, 1)",
//             "rgba(255, 159, 64, 1)",
//             "rgba(255, 99, 132, 1)",
//           ],
//           borderWidth: 1,
//         },
//       ],
//     };

//     new Chart(chartContext, {
//       type: "bar",
//       data: chartData,
//       options: {
//         maintainAspectRatio: false,
//         scales: {
//           y: {
//             beginAtZero: true,
//           },
//         },
//       },
//     });

//     return () => {
//       if (chartCanvas) {
//         chartCanvas.remove();
//       }
//     };
//   }, [
//     activeUsers,
//     blockedUsers,
//     todayRegistered,
//     liveUsers,
//     last24,
//     zeroBalanceUsers,
//     deadUsers,
//   ]);

//   return (
//     <div>
//       <canvas ref={chartContainer} />
//     </div>
//   );
// };

// export default UsersBarGraph;
