"use client"
import React, { useState } from 'react'


const Mandi = () => {

  const [state,setState] = useState("");
  const [district,setDistrict] = useState("");
  const [market,setMarket] = useState("");
  const [commodity,setCommodity] = useState("");
  const [variety,setVariety] = useState("");
  const [grade,setGrade] = useState("");

  const [data,setData] = useState<any[]>([]);

  async function searchMandi(){

    const params = new URLSearchParams();

    if(state) params.append("state",state);
    if(district) params.append("district",district);
    if(market) params.append("market",market);
    if(commodity) params.append("commodity",commodity);
    if(variety) params.append("variety",variety);
    if(grade) params.append("grade",grade);

    const res = await fetch(`/api/mandi?${params.toString()}`);

    const result = await res.json();

    setData(result.records || []);
  }


  return (
    <div>
      <div className='p-6 bg-gray-500'>

      <h1 className="text-3xl font-bold mb-4">Search Mandi Price</h1>
        <input   placeholder="State "
        value={state}
        onChange={(e)=>setState(e.target.value)}
        className="border rounded-2xl p-2 m-2 text-black  bg-amber-600 w-[12vw]" />
        <input   placeholder="District "
        value={district}
        onChange={(e)=>setDistrict(e.target.value)}
        className="border rounded-2xl p-2 m-2 text-black  bg-amber-600 w-[12vw]" />
        <input   placeholder="Market "
        value={market}
        onChange={(e)=>setMarket(e.target.value)}
        className="border rounded-2xl p-2 m-2 text-black  bg-amber-600 w-[12vw]"  />
        <input   placeholder="commodity "
        value={commodity}
        onChange={(e)=>setCommodity(e.target.value)}
        className="border rounded-2xl p-2 m-2 text-black  bg-amber-600 w-[12vw]" />
        <input   placeholder="Varity "
        value={variety}
        onChange={(e)=>setVariety(e.target.value)}
        className="border rounded-2xl p-2 m-2 text-black  bg-amber-600 w-[12vw]" />
        <input   placeholder="Grade "
        value={grade}
        onChange={(e)=>setGrade(e.target.value)}
        className="border rounded-2xl p-2 m-2 text-black  bg-amber-600 w-[12vw]" />
        <button
        onClick={searchMandi}
        className="bg-green-600 text-white p-2 mt-4 rounded-2xl"
      >Search</button></div>

      {/* Table */}
      <div>
        <table className="mt-6 border w-full">

        <thead>
          <tr className="border">
            <th className="border p-2">State</th>
            <th className="border p-2">District</th>
            <th className="border p-2">Market</th>
            <th className="border p-2">Commodity</th>
            <th className="border p-2">Min Price</th>
            <th className="border p-2">Max Price</th>
          </tr>
        </thead>

        <tbody>

          {data.map((item,index)=>(
            <tr key={index}>
              <td className="border p-2">{item.state}</td>
              <td className="border p-2">{item.district}</td>
              <td className="border p-2">{item.market}</td>
              <td className="border p-2">{item.commodity}</td>
              <td className="border p-2">{item.min_price}</td>
              <td className="border p-2">{item.max_price}</td>
            </tr>
          ))}

        </tbody>

      </table>
      </div>
      </div>

      
     

  )
}

export default Mandi
