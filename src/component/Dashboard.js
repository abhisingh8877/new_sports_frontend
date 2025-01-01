import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../Styles/HomeStyle.css";
import { Col, Container, Row } from "react-bootstrap";
import Cards from "./Cards";
import Table from 'react-bootstrap/Table';
import { Chart } from "react-google-charts";
import Button from 'react-bootstrap/Button';
// import { usePayoutContext } from './Payoutcontext';
import { UserContext } from "./Context";
import { useContext } from "react";
import Shimmer from "./Shimmer";
import {jsPDF} from "jspdf";
import Barchart from "./BarChar";
function Dashboard() {
  const [input, setInput] = useState(""); // Author name input
  const [type, setType] = useState(""); // Content type filter
  const [dateRange, setDateRange] = useState(""); // Date range filter
  
  // const { payouts } = usePayoutContext();
  // const result = payouts.reduce((acc, { name }) => {
  //   const existing = acc.find(item => item.name === name);
  //   if (existing) {
  //     existing.count++;
  //   } else {
  //     acc.push({ name, count: 1 });
  //   }
  //   return acc;
  // }, []);
  const { news, countAllValues, authorvalue ,calculateValueforOneAuthor} = useContext(UserContext);
 
 
  const data = [
    ["Task", "Hours per Day"],
    ["Work", 11],
    ["Eat", 2],
    ["Commute", 2],
    ["Watch TV", 2],
    ["Sleep", 7],
  ];

  const options = {
    title: "My Daily Activities",
    pieHole: 0.4, // Creates a Donut Chart. Does not do anything when is3D is enabled
    is3D: true, // Enables 3D view
    // slices: {
    //   1: { offset: 0.2 }, // Explodes the second slice
    // },
    pieStartAngle: 100, // Rotates the chart
    sliceVisibilityThreshold: 0.02, // Hides slices smaller than 2%
    legend: {
      position: "bottom",
      alignment: "center",
      textStyle: {
        color: "#233238",
        fontSize: 14,
      },
      
    },
    colors: ["#8AD1C2", "#9F8AD1", "#D18A99", "#BCD18A", "#D1C28A"],
  };
  const downloadCSV=()=>{
    const header=['Author','Articles','Payout'];
    const rows=Object.entries(authorvalue).map(([keys,value])=>[keys,value,calculateValueforOneAuthor(keys)]);
    let csvContent="data:text/csv;charset=utf-8,"+header.join(",")+"\n";
    rows.forEach((rowArray)=>{
      let row=rowArray.join(",");
      csvContent+=row+"\n";
    });
    const encodedUri=encodeURI(csvContent);
    const link=document.createElement('a');
    link.setAttribute('href',encodedUri);
    link.setAttribute('download','payout_data.csv');
    document.body.appendChild(link);
    link.click();
  };
  const downloadPDF=()=>{
    const doc=new jsPDF();
     let y=10;
     doc.setFontSize(20);
     doc.text("Payout Data",14,y);
     y+=10;
     doc.setFontSize(12);
     doc.text("Author",14,y);
     doc.text("Articles",50,y);
     doc.text("Payout",100,y);
     y+=10;
     Object.entries(authorvalue).forEach(([name, count]) => {
      doc.text(name, 14, y); // Author name
      doc.text(count.toString(), 50, y); // Count (or Articles)
      const payout = calculateValueforOneAuthor(name);
      if (payout !== undefined) {
        doc.text(payout.toString(), 100, y); // Payout
      } else {
        console.error(`Failed to calculate payout for author: ${name}`);
      }
      y += 10;
    });
    doc.text("total",14,y);
    doc.text(countAllValues().toString(),100,y);
    // Save PDF
    doc.save("payout_data.pdf");
  
  };
  const downloadGoogleSheets = () => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQJmW7fFdfKto-harJeUzXoAkowVgXbIV9l2g2brPq44jslX3-Nmcw5TThQ6FnQFddt7erEz5yZzIRxy/pub?output=xlsx";
  
    window.open(sheetUrl, "_blank");
  };
  
  return (
    <section className="dashboard_section">
      <Container>
        <Row>
          <Col lg={{ span: 9, offset: 1 }}>
            <div className="ads_box d-flex justify-content-between mb-5">
              <div className="box1">
                <h2
                  style={{
                    color: "#7cbdff",
                    textShadow: "1px 2.5px 3px black",
                    textTransform: "none",
                  }}
                  className="mt-0 mb-0"
                >
                  Participate in the largest online
                </h2>
                <h2
                  style={{
                    color: "white",
                    textShadow: "1px 2.5px 3px black",
                    textTransform: "none",
                  }}
                  className="mt-0"
                >
                  market by integrating your news
                </h2>
              </div>
              <div className="box2 d-flex justify-content-center align-items-center">
                <button className="learn_more">Upload Post</button>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={11} md={12} sm={12}>
            <div className="main_container">
              <div className="search_box">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="search_bar1 ms-1 me-1 d-flex justify-content-center mb-3"
                >
                  <div className="input-group">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="form-control rounded-0"
                      placeholder="Search by Author"
                    />
                    <div className="input-group-append search_bar_button_box">
                      <button className="btn btn-primary rounded-0" type="submit">
                        <i className="bi bi-search"></i>
                      </button>
                    </div>
                  </div>
                  <div className="select_box_container">
                    <div className="d-flex justify-content-center align-items-center">
                      <select
                        className="form-select select_box select_boxi"
                        aria-label="Default select example"
                        onChange={(e) => setDateRange(e.target.value)}
                      >
                        <option value="">Date Range</option>
                        <option value="oldest">Oldest</option>
                        <option value="latest">Latest</option>
                      </select>
                      <select
                        className="form-select select_box"
                        aria-label="Default select example"
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="">Type</option>
                        <option value="news">News</option>
                        <option value="articles">Articles</option>
                        <option value="blogs">Blogs</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

     <Container>
     <Row className="mt-5 news_page_row">
     {
        news[0]?news[0].filter((article) =>
          input ? article.author?.toLowerCase().includes(input.toLowerCase()) : true
        )
        .slice(0, 12)
        .map((article, index) => (
          <Cards
            key={index}
            image={article.urlToImage || ""}
            paragraph={article.description || "No description available"}
            type="article"
            name={article.author || "Unknown"}
            title={article.title || "No Title"}
            date={article.publishedAt || "Unknown"}
            url={article.url||""}
          />
        )):<Shimmer/>}
   </Row>
   

   
      </Container>

      <Container>
      <Row>
      <Col>
      <div className="payout_calc">
      <div className='about_text mb-0'>
      <p style={{fontWeight:"800",fontSize:"2rem"}}>Payout
       <span style={{color:"#fc9f32"}}> &nbsp;Calculator</span></p>
      </div>

      <div>
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>Author</th>
          <th>Articles</th>
          <th>Payout</th>
        </tr>
      </thead>
      <tbody>

     {Object.entries(authorvalue).map(([keys,value],index)=>(
        <tr key={index}>
          <td>{keys}</td>
          <td>{value}</td>
          <td>{calculateValueforOneAuthor(keys)}</td>
        </tr>
      ))}
   
      <tr>
      <td colSpan={2} style={{textAlign:"end"}}>Total Payout</td>
      <td colSpan={2} style={{textAlign:"end"}}>{countAllValues()}{"₹"} </td>
      </tr>
      </tbody>
    </Table>
      
      </div>
      <div>
      <div className='about_text mb-0'>
      <div className="exportbox">
      <p style={{fontWeight:"800",fontSize:"1.2rem",marginBottom:"0",color:"rgb(22 40 55);"}}>Export Data as..</p>
      </div>
      <div className="mt-1">
      <button className="mybutton mybutton1" onClick={downloadPDF}>PDF</button>
      <button className="mybutton" onClick={downloadCSV}>CSV</button>
      <button className="mybutton" onClick={downloadGoogleSheets}>Google Sheets</button>

      </div>
      </div>
      
      </div>
      </div>

      </Col>
      <Col>
       <div className="piechart mt-2">
       {/* <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"400px"}
    /> */}
      <Barchart/>
       </div>
      </Col>
      </Row>
      </Container>
    </section>
  );
}

export default Dashboard;
