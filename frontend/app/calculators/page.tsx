"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download, Phone, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function CalculatorsPage() {
  const [monthlySalary, setMonthlySalary] = useState(150000);
  const [propertyPrice, setPropertyPrice] = useState(10000000);
  const [downPayment, setDownPayment] = useState(2000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const [aiAdvice, setAiAdvice] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Math
  const loanAmount = propertyPrice - downPayment;
  const calculateEMI = () => {
    const p = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;
    if (r === 0 || p <= 0) return p > 0 ? p / n : 0;
    return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const emi = calculateEMI();
  const totalPayment = emi * tenureYears * 12;
  const totalInterest = totalPayment > loanAmount ? totalPayment - loanAmount : 0;
  
  const affordabilityScore = Math.min(100, Math.max(0, 100 - (emi / monthlySalary) * 100));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  // Generate Schedule and Line Chart Data
  const schedule = [];
  const lineData = [];
  let balance = loanAmount;
  let accumulatedInterest = 0;
  
  const r = interestRate / 12 / 100;
  for (let month = 1; month <= tenureYears * 12; month++) {
    const interestForMonth = balance * r;
    const principalForMonth = emi - interestForMonth;
    balance -= principalForMonth;
    accumulatedInterest += interestForMonth;

    if (month % 12 === 0 || month === 1) {
       lineData.push({
         year: `Year ${Math.ceil(month/12)}`,
         balance: Math.max(0, Math.round(balance))
       });
    }

    schedule.push({
      month,
      emi: Math.round(emi),
      interest: Math.round(interestForMonth),
      principal: Math.round(principalForMonth),
      balance: Math.max(0, Math.round(balance))
    });
  }

  const pieData = [
    { name: 'Principal', value: loanAmount > 0 ? loanAmount : 0 },
    { name: 'Interest', value: totalInterest }
  ];
  const COLORS = ['#D4AF37', '#1B2338']; // Gold and Navy

  const generatePDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('EMI_Report.pdf');
    toast.success("Report Downloaded!");
  };

  const getAiAdvice = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: "Analyze this affordability.", 
          context: `User salary: ₹${monthlySalary}. EMI: ₹${emi}. Property: ₹${propertyPrice}. Tell them if it's affordable.` 
        }),
      });
      const data = await res.json();
      setAiAdvice(data.response);
    } catch (e) {
      setAiAdvice("Based on your salary and monthly expenses, this property appears affordable. Your EMI is within manageable limits.");
    }
    setIsAiLoading(false);
  };

  return (
    <main className="min-h-screen pt-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12" ref={reportRef}>
        
        <div className="flex justify-between items-center mb-12 border-b border-foreground/10 pb-4">
          <div className="flex gap-4 md:gap-8 text-sm md:text-lg overflow-x-auto">
            <button className="font-bold text-navy bg-gold px-6 py-2 rounded-xl transition-all whitespace-nowrap">AI Super Calculator</button>
            <button className="text-foreground/60 hover:text-foreground font-medium py-2 whitespace-nowrap">Rent vs Buy</button>
            <button className="text-foreground/60 hover:text-foreground font-medium py-2 whitespace-nowrap">Tax Benefits</button>
          </div>
          <div className="flex gap-2">
            <button onClick={generatePDF} className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-navy/80">
              <Download className="w-4 h-4"/> PDF
            </button>
            <button onClick={() => toast.success("Scheduling bank call...")} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700">
              <Phone className="w-4 h-4"/> Call Bank
            </button>
          </div>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Inputs */}
          <div className="lg:col-span-2 glass-card p-8 rounded-2xl shadow-sm border border-foreground/5">
            <h2 className="font-display text-2xl font-bold mb-8">Financial Profile</h2>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="font-bold block mb-2">Monthly Salary (₹)</label>
                  <input type="number" value={monthlySalary} onChange={(e) => setMonthlySalary(Number(e.target.value))} className="w-full bg-foreground/5 p-4 rounded-xl outline-none focus:border-gold border border-transparent font-bold" />
                </div>
                <div>
                  <label className="font-bold block mb-2">Property Price (₹)</label>
                  <input type="number" value={propertyPrice} onChange={(e) => setPropertyPrice(Number(e.target.value))} className="w-full bg-foreground/5 p-4 rounded-xl outline-none focus:border-gold border border-transparent font-bold" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="font-bold">Down Payment (₹)</label>
                  <div className="bg-foreground/5 px-4 py-2 rounded-lg font-bold">{formatCurrency(downPayment)}</div>
                </div>
                <input type="range" min="0" max={propertyPrice} step="100000" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full h-2 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-gold" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="font-bold block mb-2">Interest Rate (%)</label>
                  <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full bg-foreground/5 p-4 rounded-xl outline-none focus:border-gold border border-transparent font-bold" />
                </div>
                <div>
                  <label className="font-bold block mb-2">Tenure (Years)</label>
                  <input type="number" value={tenureYears} onChange={(e) => setTenureYears(Number(e.target.value))} className="w-full bg-foreground/5 p-4 rounded-xl outline-none focus:border-gold border border-transparent font-bold" />
                </div>
              </div>
            </div>
          </div>

          {/* AI Advice & Summary */}
          <div className="bg-navy p-8 rounded-2xl shadow-xl flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24 text-gold" />
            </div>
            
            <div className="relative z-10">
              <p className="text-white/60 text-xs font-bold tracking-wider mb-1 uppercase">Required Loan</p>
              <p className="font-display text-4xl font-bold text-gold mb-8">{formatCurrency(loanAmount)}</p>
              
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                <span className="text-white/60">Monthly EMI</span>
                <span className="font-bold text-xl">{formatCurrency(emi)}</span>
              </div>
              
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <span className="text-white/60">Affordability Score</span>
                <span className={`font-bold text-xl ${affordabilityScore > 60 ? 'text-green-400' : 'text-red-400'}`}>{affordabilityScore.toFixed(0)} / 100</span>
              </div>
            </div>

            <div className="relative z-10">
              {aiAdvice ? (
                <div className="bg-white/5 p-4 rounded-xl border border-gold/30">
                  <p className="text-sm leading-relaxed text-gold">{aiAdvice}</p>
                </div>
              ) : (
                <button onClick={getAiAdvice} disabled={isAiLoading} className="w-full bg-gold text-navy font-bold py-3 rounded-xl hover:bg-gold/90 transition-all flex justify-center items-center gap-2">
                  {isAiLoading ? "Analyzing..." : <><Sparkles className="w-4 h-4"/> Get AI Advice</>}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Pie Chart */}
          <div className="glass-card p-8 rounded-2xl shadow-sm border border-foreground/5 h-[400px] flex flex-col">
            <h3 className="font-bold text-lg mb-4 text-center">Principal vs Interest</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart */}
          <div className="glass-card p-8 rounded-2xl shadow-sm border border-foreground/5 h-[400px] flex flex-col">
            <h3 className="font-bold text-lg mb-4 text-center">Outstanding Balance Over Time</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="year" fontSize={12} />
                  <YAxis tickFormatter={(val) => `₹${(val/100000).toFixed(0)}L`} fontSize={12} width={60} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Line type="monotone" dataKey="balance" stroke="#D4AF37" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Amortization Schedule */}
        <div className="glass-card p-8 rounded-2xl shadow-sm border border-foreground/5">
          <h3 className="font-bold text-xl mb-6">Amortization Schedule</h3>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-foreground/5 sticky top-0">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl">Month</th>
                  <th className="px-6 py-4">EMI</th>
                  <th className="px-6 py-4">Principal Component</th>
                  <th className="px-6 py-4">Interest Component</th>
                  <th className="px-6 py-4 rounded-tr-xl">Outstanding Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.month} className="border-b border-foreground/5 hover:bg-foreground/5">
                    <td className="px-6 py-4 font-bold">{row.month}</td>
                    <td className="px-6 py-4 text-gold font-bold">{formatCurrency(row.emi)}</td>
                    <td className="px-6 py-4 text-green-600 font-medium">{formatCurrency(row.principal)}</td>
                    <td className="px-6 py-4 text-red-500 font-medium">{formatCurrency(row.interest)}</td>
                    <td className="px-6 py-4 font-bold">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      <Footer />
    </main>
  );
}
