import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Settings, Save, RotateCcw, TrendingUp, DollarSign, Activity, AlertCircle, Shield, User, X, List, Eye, PlusCircle, MoveVertical, PiggyBank, Wallet, ArrowRight, Gift, Coins, Lock, Layers, Type, Download, EyeOff, Loader2, RefreshCw, Palette } from 'lucide-react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

// --- Version Control ---
const APP_VERSION = "v2.1.4";

// --- 1. COI Data (Mortality Rates per 10,000 SA) ---
const COI_TABLE = {
  15: { M: 0.2867, F: 0.1508 }, 16: { M: 0.3792, F: 0.1717 }, 17: { M: 0.4500, F: 0.1933 }, 18: { M: 0.4867, F: 0.2025 }, 19: { M: 0.5058, F: 0.2075 },
  20: { M: 0.5200, F: 0.2108 }, 21: { M: 0.5342, F: 0.2158 }, 22: { M: 0.5567, F: 0.2275 }, 23: { M: 0.5917, F: 0.2458 }, 24: { M: 0.6350, F: 0.2692 },
  25: { M: 0.6842, F: 0.2967 }, 26: { M: 0.7375, F: 0.3058 }, 27: { M: 0.7717, F: 0.3108 }, 28: { M: 0.8042, F: 0.3167 }, 29: { M: 0.8400, F: 0.3250 },
  30: { M: 0.8842, F: 0.3342 }, 31: { M: 0.9392, F: 0.3458 }, 32: { M: 1.0075, F: 0.3667 }, 33: { M: 1.0875, F: 0.4008 }, 34: { M: 1.1775, F: 0.4358 },
  35: { M: 1.2767, F: 0.4658 }, 36: { M: 1.3842, F: 0.4950 }, 37: { M: 1.5033, F: 0.5292 }, 38: { M: 1.6242, F: 0.5767 }, 39: { M: 1.7408, F: 0.6300 },
  40: { M: 1.8783, F: 0.6850 }, 41: { M: 2.0242, F: 0.7400 }, 42: { M: 2.1967, F: 0.7925 }, 43: { M: 2.3958, F: 0.8550 }, 44: { M: 2.6158, F: 0.9317 },
  45: { M: 2.8483, F: 1.0258 }, 46: { M: 3.0950, F: 1.1308 }, 47: { M: 3.3608, F: 1.2417 }, 48: { M: 3.6508, F: 1.3633 }, 49: { M: 3.9717, F: 1.5033 },
  50: { M: 4.2800, F: 1.6600 }, 51: { M: 4.6033, F: 1.8392 }, 52: { M: 4.9492, F: 2.0125 }, 53: { M: 5.2925, F: 2.1833 }, 54: { M: 5.6283, F: 2.3442 },
  55: { M: 5.9908, F: 2.5183 }, 56: { M: 6.4075, F: 2.7292 }, 57: { M: 6.9333, F: 2.9992 }, 58: { M: 7.5700, F: 3.3350 }, 59: { M: 8.3667, F: 3.7242 },
  60: { M: 9.1192, F: 4.1533 }, 61: { M: 9.7333, F: 4.5675 }, 62: { M: 10.4933, F: 4.9858 }, 63: { M: 11.4158, F: 5.4642 }, 64: { M: 12.4842, F: 6.0158 },
  65: { M: 13.6700, F: 6.6608 }, 66: { M: 14.9100, F: 7.4133 }, 67: { M: 16.2475, F: 8.2900 }, 68: { M: 17.7683, F: 9.3017 }, 69: { M: 19.4658, F: 10.4500 },
  70: { M: 21.2967, F: 11.7342 }, 71: { M: 23.3008, F: 13.1417 }, 72: { M: 25.4308, F: 14.6142 }, 73: { M: 27.7417, F: 16.2733 }, 74: { M: 30.2200, F: 18.1275 },
  75: { M: 32.9017, F: 20.2208 }, 76: { M: 35.7608, F: 22.5742 }, 77: { M: 38.8558, F: 25.1683 }, 78: { M: 42.2192, F: 28.0583 }, 79: { M: 45.9083, F: 31.2250 },
  80: { M: 49.9517, F: 34.6900 }, 81: { M: 54.3767, F: 38.5083 }, 82: { M: 59.1433, F: 42.6950 }, 83: { M: 64.3367, F: 47.3308 }, 84: { M: 69.8767, F: 52.4183 },
  85: { M: 75.8775, F: 58.0150 }, 86: { M: 82.3958, F: 64.3375 }, 87: { M: 89.4608, F: 71.2225 }, 88: { M: 97.2767, F: 78.9833 }, 89: { M: 105.9975, F: 87.5192 },
  90: { M: 116.0308, F: 97.2775 }, 91: { M: 127.6308, F: 109.0117 }, 92: { M: 139.1333, F: 123.4608 }, 93: { M: 151.6733, F: 137.5425 }, 94: { M: 165.3425, F: 153.2292 },
  95: { M: 180.2433, F: 170.7058 }, 96: { M: 196.4883, F: 190.1758 }, 97: { M: 214.1958, F: 211.8658 }, 98: { M: 233.5008, F: 236.0300 }, 99: { M: 254.5442, F: 262.9500 },
  100: { M: 277.4850, F: 292.9408 }, 101: { M: 302.4933, F: 326.3517 }, 102: { M: 329.7550, F: 363.5733 }, 103: { M: 359.4742, F: 405.0400 }, 104: { M: 391.8708, F: 451.2367 },
  105: { M: 427.1883, F: 502.7017 }, 106: { M: 465.6883, F: 560.0367 }, 107: { M: 507.6575, F: 623.9108 }, 108: { M: 553.4100, F: 695.0708 }, 109: { M: 603.2850, F: 774.3458 },
  110: { M: 833.3333, F: 833.3333 },
};

// --- 2. Helper Functions ---
const getCOIRate = (age, gender) => {
  const safeAge = Math.min(Math.max(Math.floor(age), 15), 110);
  const rates = COI_TABLE[safeAge] || COI_TABLE[110];
  return rates[gender === '男性' ? 'M' : 'F'];
};

const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return new Intl.NumberFormat('zh-TW', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatUnit = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '0.00';
  return new Intl.NumberFormat('zh-TW', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Custom Axis Tick
const CustomizedAxisTick = (props) => {
  const { x, y, payload, customDy } = props;
  if (!payload || !payload.value) return null;
  const parts = payload.value.split('/'); 
  
  const year = parts[0].trim();
  const age = parts[parts.length - 1].trim();

  if (parts.length < 2) return <g transform={`translate(${x},${y})`}><text x={0} y={0} dy={16} textAnchor="middle" fill="#666">{payload.value}</text></g>;
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={customDy || 40} textAnchor="middle" fill="#666" fontSize={11} fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace">
        <tspan x="0" dy="0">第{year}年</tspan>
        <tspan x="0" dy="16">{age}歲</tspan>
      </text>
    </g>
  );
};

// --- 3. Main Component ---
export default function InvestmentDashboard() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthEnabled, setIsAuthEnabled] = useState(true); 
  const [isLoading, setIsLoading] = useState(true); 
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  // Dragging State
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Default Configuration
  const defaultConfig = {
    title: "富貴滿滿現金流推算模型",
    userName: "Robert Yu",
    ShowUserName: true,
    // User Info
    GD_gender: '男性',
    AG_age: 53,
    SA_sumAssured: 9600, 
    mr_loading: 150,     
    
    // Capital
    B_mdp: 6800,     
    C_gp: 1200,      
    
    // SA Adjustments
    SA_adj1_year: 0,
    SA_adj1_amount: 0,
    SA_adj2_year: 0,
    SA_adj2_amount: 0,
    SA_adj3_year: 0,
    SA_adj3_amount: 0,

    // Dividend Logic
    DividendType: 'FixedAmount',
    
    // Rates
    D_divRate: 10.477568, 
    E_navChange: 2, 
    F_growth: 12,    
    
    // Fees
    G_mgmtFee: 1.5,  
    H_years: 4,      
    
    // Simulation
    N_years: 40,     
    
    // Cash Flow Payout
    RP_reinvestRate: 15, 
    
    // Loan & Policy
    HL_amount: 24.8,
    HL_years: 17,
    FLINT_amount: 18.54,
    FLINT_years: 40,

    PP_policy: 0.00000,  
    Q_policyYears: 0,
    Bonus_Year: 30, 
    FreeCash_Year: 17,
    
    // Reinvestment Rates
    Reinvest_HL_Rate: 0, 
    Reinvest_FLINT_Rate: 0, 
    Reinvest_PP_Rate: 100, 

    // Rebalance
    RY_startYear: 5,
    RG_rate: 10,       

    // View Options
    ViewMode: 'Yearly', 
    ShowUnits: false,       
    ShowInvestAmt: true,   
    ShowUnitChange: false,  
    ShowTransfer: false,    
    ShowStdCOI: false,      
    ShowDeathBenefit: true,
    ShowHeaderMR: false, 
    ShowValueAdded: true,
    ShowReinvestNote: true,
    ReinvestNoteFontSize: 12,
    XAxis_dy: 40,

    // Chart Visibility Options
    ShowChart_HL: true,
    ShowChart_FLINT: true,
    ShowChart_PP: false,
    ShowChart_Free: true,
    ShowChart_Total: true,
    ShowChart_MDP: false,
    ShowChart_GP: false,
    ShowChart_Death: false,

    // Metric Card Visibility Options
    ShowCard_TotalValue: true,
    ShowCard_AccumFreeCash: true,
    ShowCard_TotalPP: true,
    ShowCard_FreeCashAfterPP: true,
    ShowCard_AccumBonus: true,

    // Chart Stacking Order (1 = Bottom, 4 = Top)
    Order_HL: 3,
    Order_FLINT: 1,
    Order_PP: 4,
    Order_Free: 2,

    // Chart Colors
    Color_YAxis_Left: '#64748b', 
    Color_YAxis_Right: '#1E3A8A', 
    Color_HL: '#b91c1c',
    Color_FLINT: '#f87171',
    Color_PP: '#60A5FA',
    Color_Free: '#34D399',
    Color_Total: '#1E3A8A',
    Color_MDP: '#9333EA',
    Color_GP: '#F59E0B',
    Color_Death: '#DC2626',
  };

  const [config, setConfig] = useState(defaultConfig);
  const [tempConfig, setTempConfig] = useState(defaultConfig);

  // --- Fetch Google Sheet Data ---
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const SHEET_ID = '1AN1drF63utGHiv92ZMQE8xWARNQem9fc-o3mAJmtZmQ';
      const GID = '0';
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
      
      const response = await fetch(url);
      const text = await response.text();
      
      // Robust CSV parsing to handle quoted strings with commas
      const rows = text.split(/\r?\n/).map(row => {
        return row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(cell => {
            return cell.trim().replace(/^"|"$/g, '').replace(/""/g, '"');
        });
      });
      
      const getVal = (rowIdx, colIdx = 2) => {
          if (rows[rowIdx-1] && rows[rowIdx-1][colIdx]) {
              const val = rows[rowIdx-1][colIdx].trim().replace('\r', '');
              return val === '' ? null : val;
          }
          return null;
      };

      const newConfig = { ...defaultConfig };

      // Auth
      const c4 = getVal(4); 
      let authEnabled = true;
      if (c4 !== null) {
           authEnabled = c4.toLowerCase() === 'true';
      }
      setIsAuthEnabled(authEnabled);
      if (!authEnabled) setIsAuthenticated(true); 

      // Mappings
      const mapVal = (key, row, type = 'number') => {
          const val = getVal(row);
          if (val !== null) {
              if (type === 'number') {
                  const cleanVal = val.replace(/,/g, '').replace(/[^\d.-]/g, '');
                  const num = parseFloat(cleanVal);
                  if (!isNaN(num)) newConfig[key] = num;
              } else {
                  newConfig[key] = val;
              }
          }
      };

      mapVal('userName', 5, 'string');
      mapVal('GD_gender', 6, 'string');
      mapVal('AG_age', 7);
      mapVal('N_years', 8);
      mapVal('mr_loading', 9);
      mapVal('SA_adj1_year', 10);
      mapVal('SA_adj2_year', 11);
      mapVal('SA_adj3_year', 12);
      mapVal('SA_adj1_amount', 13);
      mapVal('SA_adj2_amount', 14);
      mapVal('SA_adj3_amount', 15);
      mapVal('Bonus_Year', 16);
      mapVal('FreeCash_Year', 17);
      mapVal('Order_HL', 18);
      mapVal('Order_FLINT', 19);
      mapVal('Order_PP', 20);
      mapVal('Order_Free', 21);
      mapVal('B_mdp', 22);
      mapVal('C_gp', 23);
      mapVal('D_divRate', 25);
      mapVal('E_navChange', 26);
      mapVal('F_growth', 27);
      mapVal('G_mgmtFee', 28);
      mapVal('H_years', 29);
      mapVal('RP_reinvestRate', 30);
      mapVal('HL_amount', 31);
      mapVal('HL_years', 32);
      mapVal('Reinvest_HL_Rate', 33);
      mapVal('FLINT_amount', 34);
      mapVal('FLINT_years', 35);
      mapVal('Reinvest_FLINT_Rate', 36);
      mapVal('PP_policy', 37);
      mapVal('Q_policyYears', 38);
      mapVal('Reinvest_PP_Rate', 39);
      mapVal('RY_startYear', 40);
      mapVal('RG_rate', 41);

      // --- Custom Logic for SA_sumAssured (C24) ---
      const val_C24 = getVal(24);
      
      // Calculate Total Premium based on imported values (or defaults if import failed)
      const totalPremium = (newConfig.B_mdp || 0) + (newConfig.C_gp || 0);
      const age = Math.floor(newConfig.AG_age || 53);

      let sa_value = 0;

      if (val_C24 === null || val_C24 === '') {
          let multiplier = 1.0;
          if (age >= 15 && age <= 30) multiplier = 1.9;
          else if (age >= 31 && age <= 40) multiplier = 1.6;
          else if (age >= 41 && age <= 50) multiplier = 1.4;
          else if (age >= 51 && age <= 60) multiplier = 1.2;
          else if (age >= 61 && age <= 70) multiplier = 1.1;
          else if (age >= 71 && age <= 90) multiplier = 1.02;
          else if (age >= 91) multiplier = 1.0;

          sa_value = Math.ceil(totalPremium * multiplier);
      } else {
          const c24_num = parseFloat(val_C24.replace(/,/g, '').replace(/[^\d.-]/g, '')) || 0;
          
          if (c24_num > totalPremium) {
              sa_value = c24_num;
          } else {
              sa_value = totalPremium;
          }
      }
      
      newConfig.SA_sumAssured = sa_value;

      setConfig(prev => ({...prev, ...newConfig})); 
      setTempConfig(prev => ({...prev, ...newConfig}));

    } catch (error) {
      console.error("Error fetching Google Sheet:", error);
      setIsAuthEnabled(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- 4. Simulation Engine ---
  const { annualData, monthlyData } = useMemo(() => {
    if (!isAuthenticated && isAuthEnabled) return { annualData: [], monthlyData: [] };

    const annualData = [];
    const monthlyData = [];
    const UNIT = 10000;
    
    const INITIAL_NAV = 10;
    
    let initial_B_units = (config.B_mdp * UNIT) / INITIAL_NAV;
    let current_B_units = initial_B_units;
    let current_B_price = INITIAL_NAV;
    
    let current_C_val = config.C_gp * UNIT;
    let current_SA_val = config.SA_sumAssured * UNIT;
    const A_total_val = (config.B_mdp + config.C_gp) * UNIT;

    const monthly_E_rate = Math.pow(1 + config.E_navChange / 100, 1 / 12) - 1;
    const monthly_F_rate = Math.pow(1 + config.F_growth / 100, 1 / 12) - 1;

    const inputAge = parseFloat(config.AG_age);
    const startYearBase = Math.floor(inputAge);
    const startMonthsOffset = Math.round((inputAge % 1) * 12);
    const initialCompletedMonths = startMonthsOffset > 0 ? startMonthsOffset - 1 : 0;

    let prev_month_units = current_B_units;
    let prev_year_units = current_B_units;
    
    let pending_mgmt_fee = 0;
    let pending_ins_cost = 0;

    let next_year_bonus_amount_B = 0;
    let next_year_bonus_amount_C = 0;
    
    let total_accumulated_bonus = 0; 

    for (let year = 1; year <= config.N_years; year++) {
      if (config.SA_adj1_year > 0 && year === config.SA_adj1_year) current_SA_val = config.SA_adj1_amount * UNIT;
      if (config.SA_adj2_year > 0 && year === config.SA_adj2_year) current_SA_val = config.SA_adj2_amount * UNIT;
      if (config.SA_adj3_year > 0 && year === config.SA_adj3_year) current_SA_val = config.SA_adj3_amount * UNIT;

      let annual_value_added = 0;
      if (year >= 6) {
          const bonus_units_B = next_year_bonus_amount_B / current_B_price;
          current_B_units += bonus_units_B;
          current_C_val += next_year_bonus_amount_C;
          annual_value_added = next_year_bonus_amount_B + next_year_bonus_amount_C;
          total_accumulated_bonus += annual_value_added; 
      }

      let annual_dividend = 0;
      let annual_cash_payout = 0;
      let annual_HL = 0;
      let annual_FLINT = 0;
      let annual_policy = 0;
      let annual_free_cash = 0;
      let annual_insurance_cost = 0;
      let annual_mgmt_fee = 0;
      let annual_transfer_amount = 0;
      let annual_total_reinvest = 0; 
      
      let sum_month_end_B_val = 0;
      let sum_month_end_C_val = 0;

      const yearStartTotalMonths = initialCompletedMonths + (year - 1) * 12;
      const ageAtStartOfYear = startYearBase + Math.floor(yearStartTotalMonths / 12);

      for (let month = 1; month <= 12; month++) {
        const current_B_val_start = current_B_units * current_B_price;
        const PV_start = current_B_val_start + current_C_val;

        const currentTotalMonths = initialCompletedMonths + (year - 1) * 12 + (month - 1);
        const currentEffectiveAge = startYearBase + Math.floor(currentTotalMonths / 12);

        let mgmt_fee_pct = 0;
        if (year <= config.H_years) {
            mgmt_fee_pct = (PV_start * (config.G_mgmtFee / 100)) / 12;
        }

        let mgmt_fee_fixed = 0;
        if (A_total_val < 3000000) {
            mgmt_fee_fixed = 100;
        }

        const total_mgmt_fee = mgmt_fee_pct + mgmt_fee_fixed;
        
        const RS = Math.max(current_SA_val - PV_start, 0); 
        let insurance_cost = 0;
        const coi_rate_per_10k = getCOIRate(currentEffectiveAge, config.GD_gender);

        if (RS > 0) {
            insurance_cost = (RS / 10000) * coi_rate_per_10k * (1 + config.mr_loading / 100);
        }

        let actual_mgmt_deduct = 0;
        let actual_ins_deduct = 0;

        if (year === 1 && month === 1) {
            pending_mgmt_fee = total_mgmt_fee;
            pending_ins_cost = insurance_cost;
            actual_mgmt_deduct = 0;
            actual_ins_deduct = 0;
        } else if (year === 1 && month === 2) {
            actual_mgmt_deduct = total_mgmt_fee + pending_mgmt_fee;
            actual_ins_deduct = insurance_cost + pending_ins_cost;
            pending_mgmt_fee = 0;
            pending_ins_cost = 0;
        } else {
            actual_mgmt_deduct = total_mgmt_fee;
            actual_ins_deduct = insurance_cost;
        }

        const total_monthly_deduction = actual_mgmt_deduct + actual_ins_deduct;

        if (current_C_val >= total_monthly_deduction) {
            current_C_val -= total_monthly_deduction;
        } else {
            const remainder = total_monthly_deduction - current_C_val;
            current_C_val = 0;
            const units_to_sell = remainder / current_B_price;
            current_B_units -= units_to_sell;
        }

        current_B_price = current_B_price * (1 + monthly_E_rate);
        current_C_val = current_C_val * (1 + monthly_F_rate);

        let monthly_dividend = 0;
        const initial_B_val_full = config.B_mdp * UNIT;
        const base_div_amount = initial_B_val_full * (config.D_divRate / 100) / 12;

        if (config.DividendType === 'FixedAmount') {
            monthly_dividend = (current_B_units / initial_B_units) * base_div_amount;
        } else {
            monthly_dividend = (current_B_units * current_B_price) * (config.D_divRate / 100) / 12;
        }

        const standard_reinvest = monthly_dividend * (config.RP_reinvestRate / 100);
        let monthly_HL = 0;
        let monthly_FLINT = 0;
        let monthly_policy = 0;
        let extra_reinvest_HL = 0;
        let extra_reinvest_FLINT = 0;
        let extra_reinvest_PP = 0;

        if (year <= config.HL_years) {
            monthly_HL = config.HL_amount * UNIT;
        } else {
            extra_reinvest_HL = (config.HL_amount * UNIT) * (config.Reinvest_HL_Rate / 100);
        }

        if (year <= config.FLINT_years) {
            monthly_FLINT = config.FLINT_amount * UNIT;
        } else {
            extra_reinvest_FLINT = (config.FLINT_amount * UNIT) * (config.Reinvest_FLINT_Rate / 100);
        }

        if (year <= config.Q_policyYears) {
            monthly_policy = config.PP_policy * UNIT; 
        } else {
            extra_reinvest_PP = (config.PP_policy * UNIT) * (config.Reinvest_PP_Rate / 100);
        }

        const total_reinvest = standard_reinvest + extra_reinvest_HL + extra_reinvest_FLINT + extra_reinvest_PP;
        const units_bought = total_reinvest / current_B_price;
        current_B_units += units_bought;

        const actual_cash_payout = monthly_dividend - total_reinvest;
        const monthly_free = actual_cash_payout - monthly_HL - monthly_FLINT - monthly_policy; 

        let transfer_amount = 0;
        if (year >= config.RY_startYear) {
            transfer_amount = current_C_val * (config.RG_rate / 100) / 12; 
            current_C_val -= transfer_amount;
            const units_from_transfer = transfer_amount / current_B_price;
            current_B_units += units_from_transfer;
        }

        const month_end_B_val = current_B_units * current_B_price;
        sum_month_end_B_val += month_end_B_val;
        sum_month_end_C_val += current_C_val;

        const final_B_val_month = current_B_units * current_B_price;
        const unit_change_month = current_B_units - prev_month_units;
        prev_month_units = current_B_units;
        const total_value_month = final_B_val_month + current_C_val;
        const death_benefit = Math.max(current_SA_val, total_value_month);

        monthlyData.push({
            id: `${year}-${month}`,
            year,
            month,
            age: currentEffectiveAge, 
            xAxisLabel: `${year} / ${month} / ${currentEffectiveAge}`, 
            mdp: final_B_val_month,
            units: current_B_units,
            investAmt: total_reinvest + transfer_amount, 
            unitChange: unit_change_month,
            nav: current_B_price,
            gp: current_C_val,
            totalValue: total_value_month,
            dividend: monthly_dividend,
            cashPayout: actual_cash_payout,
            loan_HL: monthly_HL,
            loan_FLINT: monthly_FLINT,
            policy: monthly_policy,
            freeCash: monthly_free,
            insCost: actual_ins_deduct, 
            mgmtFee: actual_mgmt_deduct, 
            transfer: transfer_amount,
            valueAdded: (month === 1 ? annual_value_added : 0),
            cumulativeBonus: total_accumulated_bonus, 
            stdCOIRate: coi_rate_per_10k, 
            deathBenefit: death_benefit 
        });

        annual_dividend += monthly_dividend;
        annual_cash_payout += actual_cash_payout;
        annual_HL += monthly_HL;
        annual_FLINT += monthly_FLINT;
        annual_policy += monthly_policy;
        annual_free_cash += monthly_free;
        annual_insurance_cost += actual_ins_deduct;
        annual_mgmt_fee += actual_mgmt_deduct;
        annual_transfer_amount += transfer_amount;
        annual_total_reinvest += (total_reinvest + transfer_amount);
      }

      const avg_B_val = sum_month_end_B_val / 12;
      const avg_C_val = sum_month_end_C_val / 12;
      next_year_bonus_amount_B = avg_B_val * 0.0025;
      next_year_bonus_amount_C = avg_C_val * 0.0025;

      const final_B_val_year = current_B_units * current_B_price;
      const unit_change_year = current_B_units - prev_year_units;
      prev_year_units = current_B_units;
      const total_value_year = final_B_val_year + current_C_val;
      const death_benefit_year = Math.max(current_SA_val, total_value_year);
      
      const annual_coi_rate = getCOIRate(ageAtStartOfYear, config.GD_gender);

      annualData.push({
        id: `year-${year}`,
        year,
        age: ageAtStartOfYear,
        xAxisLabel: `${year} / ${ageAtStartOfYear}`,
        mdp: final_B_val_year,
        units: current_B_units,
        investAmt: annual_total_reinvest,
        unitChange: unit_change_year,
        gp: current_C_val,
        totalValue: total_value_year,
        dividend: annual_dividend,
        cashPayout: annual_cash_payout,
        loan_HL: annual_HL,
        loan_FLINT: annual_FLINT,
        policy: annual_policy,
        freeCash: annual_free_cash,
        transfer: annual_transfer_amount,
        insCost: annual_insurance_cost,
        mgmtFee: annual_mgmt_fee,
        valueAdded: annual_value_added, 
        stdCOIRate: annual_coi_rate,
        deathBenefit: death_benefit_year,
        cumulativeBonus: total_accumulated_bonus 
      });
    }
    return { annualData, monthlyData };
  }, [config, isAuthenticated, isAuthEnabled]);

  const displayData = config.ViewMode === 'Monthly' ? monthlyData : annualData;

  const referenceLineIndex = useMemo(() => {
    const startYear = parseFloat(config.RY_startYear);
    if (isNaN(startYear) || startYear < 1) return null;

    if (config.ViewMode === 'Monthly') {
      return (startYear - 1) * 12;
    } else {
      return startYear - 1;
    }
  }, [config.ViewMode, config.RY_startYear]);

  const cumulativeMgmtFee4Years = useMemo(() => {
    return annualData
        .filter(d => d.year <= 4)
        .reduce((sum, d) => sum + d.mgmtFee, 0);
  }, [annualData]);

  const crossoverYear = useMemo(() => {
    const match = annualData.find(d => d.cumulativeBonus > cumulativeMgmtFee4Years);
    return match ? match.year : null;
  }, [annualData, cumulativeMgmtFee4Years]);

  const cumulativeFreeCashAtCustomYear = useMemo(() => {
      return annualData
          .filter(d => d.year <= config.FreeCash_Year)
          .reduce((sum, d) => sum + d.freeCash, 0);
  }, [annualData, config.FreeCash_Year]);

  const totalPPAmount = useMemo(() => {
      return annualData.reduce((sum, d) => sum + d.policy, 0);
  }, [annualData]);

  const freeCashAfterPP = useMemo(() => {
    const targetYear = config.Q_policyYears + 1;
    const data = annualData.find(d => d.year === targetYear);
    return data ? data.freeCash : 0;
  }, [annualData, config.Q_policyYears]);
  
  const bonusAtTargetYear = useMemo(() => {
      const data = annualData.find(d => d.year === config.Bonus_Year);
      return data ? data.cumulativeBonus : 0;
  }, [annualData, config.Bonus_Year]);

  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openSettings = () => {
      setModalPosition({ x: 0, y: 0 });
      setTempConfig(config);
      setIsSettingsOpen(true);
  };

  const saveConfig = () => {
    const newConfig = {};
    Object.keys(tempConfig).forEach(key => {
      if (['title', 'GD_gender', 'DividendType', 'ViewMode', 'userName', 'Color_YAxis_Left', 'Color_YAxis_Right', 'Color_HL', 'Color_FLINT', 'Color_PP', 'Color_Free', 'Color_Total', 'Color_MDP', 'Color_GP', 'Color_Death'].includes(key)) {
        newConfig[key] = tempConfig[key];
      } else if (typeof tempConfig[key] === 'boolean') {
        newConfig[key] = tempConfig[key];
      } else {
        const parsed = parseFloat(tempConfig[key]);
        newConfig[key] = isNaN(parsed) ? 0 : parsed;
      }
    });
    setConfig(newConfig);
    setIsSettingsOpen(false);
  };

  const resetConfig = () => {
    setTempConfig(defaultConfig);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
        x: e.clientX - modalPosition.x,
        y: e.clientY - modalPosition.y
    });
  };

  // Modified Authentication Logic
  const handleLogin = (e) => {
    e.preventDefault();
    const validPasswords = ['A32188', '89788', '317151', '321709'];
    if (validPasswords.includes(passwordInput)) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleExportCSV = () => {
    const headers = ['時間 (年/月/歲)', '月配息組合 (MDP)'];
    if (config.ShowUnits) headers.push('配息基金單位數');
    if (config.ShowInvestAmt) headers.push('投入配息基金金額');
    if (config.ShowUnitChange) headers.push('單位數變動');
    headers.push('成長型組合 (GP)');
    if (config.ShowTransfer) headers.push('成長型轉入金額');
    if (config.ShowStdCOI) headers.push('標準費率');
    headers.push('危險保費 (Ins Cost)');
    headers.push('管理費 (Fee)');
    if (config.ShowValueAdded) headers.push('加值給付 (Bonus)');
    headers.push('總配息 (100%)');
    headers.push(`現金給付 (${100 - config.RP_reinvestRate}%)`);
    headers.push('房貸 (HL)');
    headers.push('週轉息 (FLINT)');
    headers.push('小水庫保單 (PP)');
    headers.push('自由活用資金');
    headers.push('總帳戶價值 (PV)');
    if (config.ShowDeathBenefit) headers.push('身故保險金');

    const csvRows = displayData.map(row => {
      const timeLabel = config.ViewMode === 'Monthly' 
        ? `${row.year}/${row.month}/${row.age}` 
        : `${row.year}/${row.age}`;
      
      const rowData = [timeLabel, Math.round(row.mdp)];
      if (config.ShowUnits) rowData.push(row.units.toFixed(2));
      if (config.ShowInvestAmt) rowData.push(Math.round(row.investAmt));
      if (config.ShowUnitChange) rowData.push(row.unitChange.toFixed(2));
      rowData.push(Math.round(row.gp));
      if (config.ShowTransfer) rowData.push(Math.round(row.transfer));
      if (config.ShowStdCOI) rowData.push(row.stdCOIRate);
      rowData.push(Math.round(row.insCost));
      rowData.push(Math.round(row.mgmtFee));
      if (config.ShowValueAdded) rowData.push(Math.round(row.valueAdded));
      rowData.push(Math.round(row.dividend));
      rowData.push(Math.round(row.cashPayout));
      rowData.push(Math.round(row.loan_HL));
      rowData.push(Math.round(row.loan_FLINT));
      rowData.push(Math.round(row.policy));
      rowData.push(Math.round(row.freeCash));
      rowData.push(Math.round(row.totalValue));
      if (config.ShowDeathBenefit) rowData.push(Math.round(row.deathBenefit));
      
      return rowData.join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.title}_${config.ViewMode === 'Monthly' ? '月報表' : '年報表'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
        if (isDragging) {
            setModalPosition({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
            });
        }
    };
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  useEffect(() => {
    if (isSettingsOpen) {
        setTempConfig(config);
    }
  }, [isSettingsOpen, config]);

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans flex-col">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">正在讀取雲端參數...</p>
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated && isAuthEnabled) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex flex-col items-center justify-center mb-4">
               <img 
                 src="https://upload.wikimedia.org/wikipedia/commons/6/67/Allianz_Logo.svg" 
                 alt="Allianz Logo" 
                 className="h-16 w-auto mb-2"
                 onError={(e) => e.target.style.display = 'none'}
               />
               <span className="text-slate-500 font-bold tracking-widest text-sm">Allianz 安聯人壽</span>
            </div>
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">安全登入</h1>
            <p className="text-slate-500 text-sm">請輸入存取密碼以檢視富貴滿滿現金流模型</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="請輸入密碼"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-center text-lg tracking-widest placeholder:tracking-normal"
                autoFocus
              />
              {loginError && (
                <div className="flex items-center justify-center gap-1.5 mt-2 text-red-500 text-sm animate-pulse">
                  <AlertCircle className="w-4 h-4" />
                  <span>密碼錯誤，請重新輸入</span>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform active:scale-95 transition-all"
            >
              登入
            </button>
          </form>
          <div className="text-center text-xs text-slate-400">
            受保護的財務模型系統
          </div>
        </div>
      </div>
    );
  }

  // --- Dynamic Stack Order ---
  const stackItems = [
    { key: 'loan_HL', name: '房貸 (HL)', fill: config.Color_HL, order: config.Order_HL, show: config.ShowChart_HL },
    { key: 'loan_FLINT', name: '週轉息 (FLINT)', fill: config.Color_FLINT, order: config.Order_FLINT, show: config.ShowChart_FLINT },
    { key: 'policy', name: '小水庫保單 (PP)', fill: config.Color_PP, order: config.Order_PP, show: config.ShowChart_PP },
    { key: 'freeCash', name: '自由資金', fill: config.Color_Free, order: config.Order_Free, show: config.ShowChart_Free }
  ].filter(item => item.show).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative">
      <header className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-emerald-400" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-wide">{config.title}</h1>
                {config.ShowUserName && config.userName && (
                  <span className="text-lg font-medium text-slate-300">({config.userName})</span>
                )}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {config.GD_gender} | {config.AG_age}歲 | 保額 {config.SA_sumAssured}萬 | {config.ViewMode === 'Monthly' ? '月度報表' : '年度報表'} 
                {config.ShowHeaderMR && ` | 加費比例(mr) ${config.mr_loading}%`}
              </div>
              {config.ShowReinvestNote && (
                 <div 
                    className="text-emerald-400/80 font-mono mt-0.5"
                    style={{ fontSize: `${config.ReinvestNoteFontSize}px` }}
                 >
                    (第{config.HL_years}年後房貸繳滿後，現金流{config.Reinvest_HL_Rate}%回購配息基金，{100 - config.Reinvest_HL_Rate}%轉自由現金流） | (第{config.Q_policyYears}年後小水庫保單繳費期滿後，現金流{config.Reinvest_PP_Rate}%回購配息基金，{100 - config.Reinvest_PP_Rate}%轉自由現金流）
                 </div>
              )}
            </div>
          </div>
          <button 
            onClick={openSettings}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all text-sm font-medium border border-slate-600"
          >
            <Settings className="h-4 w-4" />
            設定
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {config.ShowCard_TotalValue && (
            <MetricCard 
              title={`第${config.N_years}年 總帳戶價值`} 
              value={formatCurrency(annualData[annualData.length - 1]?.totalValue || 0)} 
              icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
              trend={annualData[annualData.length - 1]?.totalValue > ((config.B_mdp + config.C_gp) * 10000) ? "up" : "down"}
              subtext={`初始投入: ${formatCurrency((config.B_mdp + config.C_gp) * 10000)}`}
            />
          )}
          {config.ShowCard_AccumFreeCash && (
            <MetricCard 
              title={`第${config.FreeCash_Year}年 累積自由現金流`} 
              value={formatCurrency(cumulativeFreeCashAtCustomYear)} 
              icon={<Coins className="h-5 w-5 text-green-600" />}
              subtext={`累積至第 ${config.FreeCash_Year} 年`}
            />
          )}
          {config.ShowCard_TotalPP && (
            <MetricCard 
              title="小水庫保單累積保費" 
              value={formatCurrency(totalPPAmount)} 
              icon={<PiggyBank className="h-5 w-5 text-indigo-600" />}
              subtext={`繳費 ${Math.min(config.Q_policyYears, config.N_years)} 年總和`}
            />
          )}
          {config.ShowCard_FreeCashAfterPP && (
            <MetricCard 
              title={`小水庫保單繳費期滿隔年(第${config.Q_policyYears + 1}年)自由現金流`} 
              value={formatCurrency(freeCashAfterPP)} 
              icon={<Activity className="h-5 w-5 text-emerald-600" />}
              isCurrency
              highlightNegative
              subtext="期滿後現金流釋放"
            />
          )}
          {config.ShowCard_AccumBonus && (
            <MetricCard 
              title={`第${config.Bonus_Year}年 累積加值給付金`} 
              value={formatCurrency(bonusAtTargetYear)} 
              icon={<Gift className="h-5 w-5 text-rose-500" />}
              subtext={`累積至第 ${config.Bonus_Year} 年`}
            />
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-slate-500" />
            {config.N_years}年 資產與現金流趨勢 ({config.ViewMode === 'Monthly' ? '月度細節' : '年度總覽'})
          </h2>
          <div className="h-[600px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={displayData} margin={{ top: 30, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                    dataKey="xAxisLabel" 
                    height={80} 
                    tick={<CustomizedAxisTick customDy={config.XAxis_dy} />} 
                    interval={config.ViewMode === 'Monthly' ? 11 : 0} 
                    minTickGap={30}
                />
                <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    label={{ value: '現金流', angle: 0, position: 'top', offset: 20, fill: config.Color_YAxis_Left }} 
                    tickFormatter={(val) => `${new Intl.NumberFormat('zh-TW').format(val / 10000)}萬`} 
                    tick={{ fill: config.Color_YAxis_Left }}
                />
                <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: '資產價值', angle: 0, position: 'top', offset: 20, fill: config.Color_YAxis_Right }} 
                    tickFormatter={(val) => `${new Intl.NumberFormat('zh-TW').format(val / 10000)}萬`} 
                    domain={['auto', 'auto']} 
                    tick={{ fill: config.Color_YAxis_Right }}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(Math.round(value))}
                  labelFormatter={(label) => {
                      if (config.ViewMode === 'Monthly') {
                          const parts = label.split('/');
                          if (parts.length >= 3) {
                              return `第 ${parts[0].trim()} 年 / ${parts[1].trim()} 月：${parts[parts.length-1].trim()} 歲`;
                          }
                          return `時間: ${label}`;
                      }
                      const parts = label.split('/');
                      return `第 ${parts[0].trim()} 年${parts.length > 1 ? ` / ${parts[1].trim()} 歲` : ''}`;
                  }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }} 
                />
                <Legend verticalAlign="top" height={36} />
                
                {stackItems.map(item => (
                  <Bar 
                    key={item.key} 
                    yAxisId="left" 
                    dataKey={item.key} 
                    name={item.name} 
                    stackId="a" 
                    fill={item.fill} 
                  />
                ))}

                {config.ShowChart_Total && <Line yAxisId="right" type="monotone" dataKey="totalValue" name="總帳戶價值" stroke={config.Color_Total} strokeWidth={3} dot={false} />}
                {config.ShowChart_MDP && <Line yAxisId="right" type="monotone" dataKey="mdp" name="月配息組合 (MDP)" stroke={config.Color_MDP} strokeDasharray="5 5" strokeWidth={2} dot={false} />}
                {config.ShowChart_GP && <Line yAxisId="right" type="monotone" dataKey="gp" name="成長型組合 (GP)" stroke={config.Color_GP} strokeDasharray="5 5" strokeWidth={2} dot={false} />}
                {config.ShowChart_Death && <Line yAxisId="right" type="step" dataKey="deathBenefit" name="身故保險金" stroke={config.Color_Death} strokeWidth={5} dot={false} strokeDasharray="3 3" />}
                
                {referenceLineIndex !== null && (
                  <ReferenceLine 
                    x={referenceLineIndex} 
                    yAxisId="right" 
                    stroke="red" 
                    strokeDasharray="3 3" 
                    label={{ value: '啟動移轉', position: 'top', fill: 'red', fontSize: 12 }} 
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center overflow-x-auto">
            <h2 className="text-lg font-bold text-slate-800 whitespace-nowrap mr-4">年度詳細數據報表 (單位: 元)</h2>
            <div className="flex gap-2 whitespace-nowrap">
               <button 
                 onClick={handleExportCSV}
                 className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-sm"
               >
                 <Download className="h-3 w-3" />
                 匯出 Excel (CSV)
               </button>
               <span className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded border border-red-200 flex items-center">SA={config.SA_sumAssured}萬</span>
               <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded border border-emerald-200 flex items-center">RY={config.RY_startYear}年起, RG={config.RG_rate}% 移轉</span>
            </div>
          </div>
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-sm text-right whitespace-nowrap relative">
              <thead className="bg-slate-100 text-slate-600 font-semibold sticky top-0 z-20 shadow-sm">
                <tr>
                  <th className="p-3 text-center border-b sticky left-0 z-30 bg-slate-100 border-r border-slate-200">{config.ViewMode === 'Monthly' ? '年/月/歲' : '年/歲'}</th>
                  <th className="p-3 border-b text-purple-700">月配息組合<br/>(MDP)</th>
                  {config.ShowUnits && <th className="p-3 border-b text-purple-500 bg-purple-50">配息基金<br/>單位數</th>}
                  {config.ShowInvestAmt && <th className="p-3 border-b text-indigo-600 bg-indigo-50">投入配息基金<br/>金額 (Amt)</th>}
                  {config.ShowUnitChange && <th className="p-3 border-b text-purple-600 bg-purple-100">單位數變動<br/>(Change)</th>}
                  <th className="p-3 border-b text-amber-600">成長型組合<br/>(GP)</th>
                  {config.ShowTransfer && <th className="p-3 border-b text-emerald-600 bg-emerald-50">成長型轉入<br/>配息型金額</th>}
                  {config.ShowStdCOI && <th className="p-3 border-b border-l text-red-400 bg-red-50">標準費率<br/>(元/萬)</th>}
                  <th className="p-3 border-b border-l text-red-500">{config.ViewMode === 'Monthly' ? '當月' : '年度'}危險保費<br/>(Ins Cost)</th>
                  <th className="p-3 border-b text-slate-500">{config.ViewMode === 'Monthly' ? '當月' : '年度'}管理費<br/>(Fee)</th>
                  {config.ShowValueAdded && <th className="p-3 border-b text-yellow-600 bg-yellow-50">加值給付<br/>(Bonus)</th>}
                  <th className="p-3 border-b border-l bg-slate-50">{config.ViewMode === 'Monthly' ? '當月' : '年度'}總配息<br/>(100%)</th>
                  <th className="p-3 border-b bg-emerald-50 text-emerald-700">現金給付<br/>({100-config.RP_reinvestRate}%)</th>
                  <th className="p-3 border-b border-l text-red-700">房貸<br/>(HL)</th>
                  <th className="p-3 border-b text-red-500">週轉息<br/>(FLINT)</th>
                  <th className="p-3 border-b text-blue-500">小水庫保單<br/>(PP)</th>
                  <th className="p-3 border-b bg-green-100 text-green-800 font-bold">自由活用<br/>資金</th>
                  <th className="p-3 border-b border-l text-blue-900 bg-slate-200 font-bold">總帳戶價值<br/>(PV)</th>
                  {config.ShowDeathBenefit && <th className="p-3 border-b text-red-800 bg-red-100 font-bold sticky right-0 z-20 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">身故保險金<br/>(Death Benefit)</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {displayData.map((row) => (
                  <tr key={row.id || row.year} className={`group hover:bg-slate-50 transition-colors ${config.ViewMode === 'Monthly' && row.month === 12 ? 'border-b-2 border-slate-300' : ''}`}>
                    <td className="p-3 text-center font-medium text-slate-700 border-r sticky left-0 z-10 bg-white group-hover:bg-slate-50 border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{config.ViewMode === 'Monthly' ? `${row.year} / ${row.month} / ${row.age}` : `${row.year} / ${row.age}`}</td>
                    <td className="p-3 text-purple-700 tabular-nums">{formatCurrency(Math.round(row.mdp))}</td>
                    {config.ShowUnits && <td className="p-3 text-purple-500 bg-purple-50 tabular-nums">{formatUnit(row.units)}</td>}
                    {config.ShowInvestAmt && <td className="p-3 text-indigo-600 bg-indigo-50 tabular-nums">{formatCurrency(Math.round(row.investAmt))}</td>}
                    {config.ShowUnitChange && (
                        <td className={`p-3 tabular-nums font-bold ${row.unitChange >= 0 ? 'text-green-600' : 'text-red-600'} bg-purple-100`}>
                            {row.unitChange >= 0 ? '+' : ''}{formatUnit(row.unitChange)}
                        </td>
                    )}
                    <td className="p-3 text-amber-600 tabular-nums">{formatCurrency(Math.round(row.gp))}</td>
                    {config.ShowTransfer && <td className="p-3 text-emerald-600 bg-emerald-50 tabular-nums">{formatCurrency(Math.round(row.transfer))}</td>}
                    {config.ShowStdCOI && <td className="p-3 text-red-400 bg-red-50 border-l tabular-nums">{row.stdCOIRate}</td>}
                    <td className="p-3 text-red-500 border-l tabular-nums">{formatCurrency(Math.round(row.insCost))}</td>
                    <td className="p-3 text-slate-500 tabular-nums">{formatCurrency(Math.round(row.mgmtFee))}</td>
                    {config.ShowValueAdded && (
                      <td className={`p-3 text-yellow-600 bg-yellow-50 tabular-nums ${row.year === crossoverYear ? '!border-b-4 !border-yellow-600' : ''}`}>
                        {formatCurrency(Math.round(row.valueAdded))}
                      </td>
                    )}
                    <td className="p-3 font-medium bg-slate-50 border-l tabular-nums">{formatCurrency(Math.round(row.dividend))}</td>
                    <td className="p-3 font-bold text-emerald-700 bg-emerald-50 tabular-nums">{formatCurrency(Math.round(row.cashPayout))}</td>
                    <td className="p-3 text-red-700 border-l tabular-nums">{formatCurrency(Math.round(row.loan_HL))}</td>
                    <td className="p-3 text-red-500 tabular-nums">{formatCurrency(Math.round(row.loan_FLINT))}</td>
                    <td className="p-3 text-blue-500 tabular-nums">{formatCurrency(Math.round(row.policy))}</td>
                    <td className={`p-3 font-bold tabular-nums ${row.freeCash < 0 ? 'text-red-600 bg-red-50' : 'text-green-800 bg-green-50'}`}>{formatCurrency(Math.round(row.freeCash))}</td>
                    <td className="p-3 font-bold text-blue-900 bg-slate-50 border-l tabular-nums">{formatCurrency(Math.round(row.totalValue))}</td>
                    {config.ShowDeathBenefit && <td className="p-3 font-bold text-red-800 bg-red-100 border-l tabular-nums sticky right-0 z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">{formatCurrency(Math.round(row.deathBenefit))}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isSettingsOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                style={{ 
                    transform: `translate(${modalPosition.x}px, ${modalPosition.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
            >
              <div 
                className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 cursor-move select-none"
                onMouseDown={handleMouseDown}
              >
                <div className="flex items-center gap-2 pointer-events-none">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    模型參數設定
                  </h2>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">{APP_VERSION}</span>
                </div>
                <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" onMouseDown={(e) => e.stopPropagation()}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
                
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b pb-1 flex items-center gap-2">User & Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <InputGroup label="報表標題名稱" name="title" value={tempConfig.title} onChange={handleConfigChange} type="text" />
                     <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-600">客戶姓名</label>
                        <div className="flex items-center gap-2">
                          <input type="text" name="userName" value={tempConfig.userName} onChange={handleConfigChange} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                          <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
                            <input type="checkbox" name="ShowUserName" checked={tempConfig.ShowUserName} onChange={handleConfigChange} className="rounded text-blue-600 focus:ring-blue-500" />
                            <span className="text-xs text-slate-600">顯示</span>
                          </label>
                        </div>
                     </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-slate-600">GD: 性別</label>
                      <select name="GD_gender" value={tempConfig.GD_gender} onChange={handleConfigChange} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono">
                        <option value="男性">男性</option>
                        <option value="女性">女性</option>
                      </select>
                    </div>
                    <InputGroup label="AG: 年齡" name="AG_age" value={tempConfig.AG_age} onChange={handleConfigChange} suffix="歲" step="0.1" />
                    <InputGroup label="N: 模擬年期" name="N_years" value={tempConfig.N_years} onChange={handleConfigChange} suffix="年" />
                    <InputGroup label="mr: 危險保費加費" name="mr_loading" value={tempConfig.mr_loading} onChange={handleConfigChange} suffix="%" />
                    
                    <div className="col-span-1 md:col-span-2 bg-slate-50 p-3 rounded-md border border-slate-200 mt-2">
                      <div className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1"><PlusCircle className="h-3 w-3" /> 保額動態調整計畫 (選填)</div>
                      <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="第1次調整年度" name="SA_adj1_year" value={tempConfig.SA_adj1_year} onChange={handleConfigChange} suffix="年" />
                        <InputGroup label="第1次調整後保額" name="SA_adj1_amount" value={tempConfig.SA_adj1_amount} onChange={handleConfigChange} suffix="萬元" />
                        <InputGroup label="第2次調整年度" name="SA_adj2_year" value={tempConfig.SA_adj2_year} onChange={handleConfigChange} suffix="年" />
                        <InputGroup label="第2次調整後保額" name="SA_adj2_amount" value={tempConfig.SA_adj2_amount} onChange={handleConfigChange} suffix="萬元" />
                        <InputGroup label="第3次調整年度" name="SA_adj3_year" value={tempConfig.SA_adj3_year} onChange={handleConfigChange} suffix="年" />
                        <InputGroup label="第3次調整後保額" name="SA_adj3_amount" value={tempConfig.SA_adj3_amount} onChange={handleConfigChange} suffix="萬元" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider border-b border-slate-300 pb-1 flex items-center gap-2">Display Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-slate-600">報表顯示模式</label>
                          <div className="flex gap-4 mt-1">
                              <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="ViewMode" value="Yearly" checked={tempConfig.ViewMode === 'Yearly'} onChange={handleConfigChange} className="text-blue-600 focus:ring-blue-500" /><span className="text-sm text-slate-700">年度報表</span></label>
                              <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="ViewMode" value="Monthly" checked={tempConfig.ViewMode === 'Monthly'} onChange={handleConfigChange} className="text-blue-600 focus:ring-blue-500" /><span className="text-sm text-slate-700">月度報表</span></label>
                          </div>
                      </div>
                      <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-slate-600 flex items-center gap-2"><Eye className="h-3 w-3" /> 進階欄位</label>
                          <div className="flex flex-col gap-2 mt-2">
                              <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" name="ShowUnits" checked={tempConfig.ShowUnits} onChange={handleConfigChange} className="sr-only peer" /><div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div><span className="ml-3 text-sm text-slate-700">顯示 B 單位數</span></label>
                              <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" name="ShowInvestAmt" checked={tempConfig.ShowInvestAmt} onChange={handleConfigChange} className="sr-only peer" /><div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div><span className="ml-3 text-sm text-slate-700">顯示投入配息金額</span></label>
                              <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" name="ShowUnitChange" checked={tempConfig.ShowUnitChange} onChange={handleConfigChange} className="sr-only peer" /><div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div><span className="ml-3 text-sm text-slate-700">顯示單位數變動</span></label>
                              <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" name="ShowTransfer" checked={tempConfig.ShowTransfer} onChange={handleConfigChange} className="sr-only peer" /><div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div><span className="ml-3 text-sm text-slate-700">顯示 C 轉 B 金額</span></label>
                              <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" name="ShowStdCOI" checked={tempConfig.ShowStdCOI} onChange={handleConfigChange} className="sr-only peer" /><div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-400"></div><span className="ml-3 text-sm text-slate-700">顯示標準費率</span></label>
                              <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" name="ShowHeaderMR" checked={tempConfig.ShowHeaderMR} onChange={handleConfigChange} className="sr-only peer" /><div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div><span className="ml-3 text-sm text-slate-700">顯示表頭加費比例</span></label>
                              <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" name="ShowValueAdded" checked={tempConfig.ShowValueAdded} onChange={handleConfigChange} className="sr-only peer" /><div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-yellow-500"></div><span className="ml-3 text-sm text-slate-700">顯示加值給付金</span></label>
                              <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" name="ShowDeathBenefit" checked={tempConfig.ShowDeathBenefit} onChange={handleConfigChange} className="sr-only peer" /><div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div><span className="ml-3 text-sm text-slate-700">顯示身故保險金</span></label>
                              <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" name="ShowReinvestNote" checked={tempConfig.ShowReinvestNote} onChange={handleConfigChange} className="sr-only peer" /><div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div><span className="ml-3 text-sm text-slate-700">顯示回購/自由現金流註記</span></label>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-slate-600 font-semibold whitespace-nowrap"><Type className="h-3 w-3 inline mr-1"/>註記文字大小 (px)</span>
                                <input type="number" name="ReinvestNoteFontSize" value={tempConfig.ReinvestNoteFontSize} onChange={handleConfigChange} className="w-20 border border-slate-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono" />
                              </div>
                          </div>
                      </div>
                      
                      <div className="md:col-span-2 mt-2 pt-2 border-t border-slate-200">
                        <label className="text-xs font-bold text-slate-600 flex items-center gap-2 mb-2"><EyeOff className="h-3 w-3" /> 圖表顯示項目 (可開關)</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="ShowChart_HL" checked={tempConfig.ShowChart_HL} onChange={handleConfigChange} className="rounded text-blue-600 focus:ring-blue-500" /><span className="text-xs text-slate-700">房貸 (HL)</span></label>
                          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="ShowChart_FLINT" checked={tempConfig.ShowChart_FLINT} onChange={handleConfigChange} className="rounded text-blue-600 focus:ring-blue-500" /><span className="text-xs text-slate-700">週轉息 (FLINT)</span></label>
                          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="ShowChart_PP" checked={tempConfig.ShowChart_PP} onChange={handleConfigChange} className="rounded text-blue-600 focus:ring-blue-500" /><span className="text-xs text-slate-700">小水庫保單 (PP)</span></label>
                          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="ShowChart_Free" checked={tempConfig.ShowChart_Free} onChange={handleConfigChange} className="rounded text-blue-600 focus:ring-blue-500" /><span className="text-xs text-slate-700">自由資金</span></label>
                          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="ShowChart_Total" checked={tempConfig.ShowChart_Total} onChange={handleConfigChange} className="rounded text-blue-600 focus:ring-blue-500" /><span className="text-xs text-slate-700">總帳戶價值</span></label>
                          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="ShowChart_MDP" checked={tempConfig.ShowChart_MDP} onChange={handleConfigChange} className="rounded text-blue-600 focus:ring-blue-500" /><span className="text-xs text-slate-700">月配息組合 (MDP)</span></label>
                          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="ShowChart_GP" checked={tempConfig.ShowChart_GP} onChange={handleConfigChange} className="rounded text-blue-600 focus:ring-blue-500" /><span className="text-xs text-slate-700">成長型組合 (GP)</span></label>
                          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="ShowChart_Death" checked={tempConfig.ShowChart_Death} onChange={handleConfigChange} className="rounded text-blue-600 focus:ring-blue-500" /><span className="text-xs text-slate-700 font-bold text-red-600">身故保險金</span></label>
                        </div>
                      </div>

                      <div className="md:col-span-2 mt-2 pt-2 border-t border-slate-200">
                        <label className="text-xs font-bold text-slate-600 flex items-center gap-2 mb-2"><EyeOff className="h-3 w-3" /> 上方卡片顯示 (可開關)</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="ShowCard_TotalValue" checked={tempConfig.ShowCard_TotalValue} onChange={handleConfigChange} className="rounded text-blue-600 focus:ring-blue-500" /><span className="text-xs text-slate-700">總帳戶價值</span></label>
                          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="ShowCard_AccumFreeCash" checked={tempConfig.ShowCard_AccumFreeCash} onChange={handleConfigChange} className="rounded text-blue-600 focus:ring-blue-500" /><span className="text-xs text-slate-700">累積自由現金流</span></label>
                          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="ShowCard_TotalPP" checked={tempConfig.ShowCard_TotalPP} onChange={handleConfigChange} className="rounded text-blue-600 focus:ring-blue-500" /><span className="text-xs text-slate-700">小水庫累積保費</span></label>
                          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="ShowCard_FreeCashAfterPP" checked={tempConfig.ShowCard_FreeCashAfterPP} onChange={handleConfigChange} className="rounded text-blue-600 focus:ring-blue-500" /><span className="text-xs text-slate-700">期滿後自由現金流</span></label>
                          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="ShowCard_AccumBonus" checked={tempConfig.ShowCard_AccumBonus} onChange={handleConfigChange} className="rounded text-blue-600 focus:ring-blue-500" /><span className="text-xs text-slate-700">累積加值給付金</span></label>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                           <label className="text-xs font-semibold text-slate-600 flex items-center gap-2"><MoveVertical className="h-3 w-3" /> 橫軸文字位移 (dy)</label>
                          <input type="number" name="XAxis_dy" value={tempConfig.XAxis_dy} onChange={handleConfigChange} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono" />
                      </div>
                      <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-slate-600 flex items-center gap-2">加值給付金檢視年期</label>
                          <input type="number" name="Bonus_Year" value={tempConfig.Bonus_Year} onChange={handleConfigChange} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono" />
                      </div>
                      <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-slate-600 flex items-center gap-2">自由現金流檢視年期</label>
                          <input type="number" name="FreeCash_Year" value={tempConfig.FreeCash_Year} onChange={handleConfigChange} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono" />
                      </div>
                      
                      <div className="md:col-span-2 mt-2 pt-2 border-t border-slate-200">
                        <label className="text-xs font-bold text-slate-600 flex items-center gap-2 mb-2"><Layers className="h-3 w-3" /> 圖表堆疊顯示順序 (數字越小越靠底層)</label>
                        <div className="grid grid-cols-2 gap-4">
                          <InputGroup label="房貸 (HL) 順序" name="Order_HL" value={tempConfig.Order_HL} onChange={handleConfigChange} type="number" />
                          <InputGroup label="週轉息 (FLINT) 順序" name="Order_FLINT" value={tempConfig.Order_FLINT} onChange={handleConfigChange} type="number" />
                          <InputGroup label="小水庫保單 (PP) 順序" name="Order_PP" value={tempConfig.Order_PP} onChange={handleConfigChange} type="number" />
                          <InputGroup label="自由資金順序" name="Order_Free" value={tempConfig.Order_Free} onChange={handleConfigChange} type="number" />
                        </div>
                      </div>

                      <div className="md:col-span-2 mt-2 pt-2 border-t border-slate-200">
                        <label className="text-xs font-bold text-slate-600 flex items-center gap-2 mb-2"><Palette className="h-3 w-3" /> 圖表顏色設定</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg">
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold text-slate-500 border-b pb-1">座標軸文字</h4>
                                <ColorInputGroup label="左Y軸 (現金流)" name="Color_YAxis_Left" value={tempConfig.Color_YAxis_Left} onChange={handleConfigChange} />
                                <ColorInputGroup label="右Y軸 (資產價值)" name="Color_YAxis_Right" value={tempConfig.Color_YAxis_Right} onChange={handleConfigChange} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold text-slate-500 border-b pb-1">圖表數列</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <ColorInputGroup label="房貸 (HL)" name="Color_HL" value={tempConfig.Color_HL} onChange={handleConfigChange} />
                                    <ColorInputGroup label="週轉息 (FLINT)" name="Color_FLINT" value={tempConfig.Color_FLINT} onChange={handleConfigChange} />
                                    <ColorInputGroup label="小水庫保單 (PP)" name="Color_PP" value={tempConfig.Color_PP} onChange={handleConfigChange} />
                                    <ColorInputGroup label="自由資金" name="Color_Free" value={tempConfig.Color_Free} onChange={handleConfigChange} />
                                    <ColorInputGroup label="總帳戶價值" name="Color_Total" value={tempConfig.Color_Total} onChange={handleConfigChange} />
                                    <ColorInputGroup label="月配息組合 (MDP)" name="Color_MDP" value={tempConfig.Color_MDP} onChange={handleConfigChange} />
                                    <ColorInputGroup label="成長型組合 (GP)" name="Color_GP" value={tempConfig.Color_GP} onChange={handleConfigChange} />
                                    <ColorInputGroup label="身故保險金" name="Color_Death" value={tempConfig.Color_Death} onChange={handleConfigChange} />
                                </div>
                            </div>
                        </div>
                      </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b pb-1">Capital & Protection</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="md:col-span-2 text-xs font-semibold text-slate-500">
                          總保費 A = B + C (自動計算): 
                          <span className="ml-2 text-lg text-slate-800 font-bold font-mono">
                              {formatCurrency((parseFloat(tempConfig.B_mdp) || 0) + (parseFloat(tempConfig.C_gp) || 0))} 萬元
                          </span>
                      </div>
                  </div>
                  <InputGroup label="B: 月配息本金 (MDP)" name="B_mdp" value={tempConfig.B_mdp} onChange={handleConfigChange} />
                  <InputGroup label="C: 成長型本金 (GP)" name="C_gp" value={tempConfig.C_gp} onChange={handleConfigChange} />
                  <InputGroup label="SA: 保額" name="SA_sumAssured" value={tempConfig.SA_sumAssured} onChange={handleConfigChange} />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b pb-1">Market Rates</h3>
                  <div className="flex flex-col gap-1 mb-2">
                      <label className="text-xs font-semibold text-slate-600">配息型式</label>
                      <select name="DividendType" value={tempConfig.DividendType} onChange={handleConfigChange} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono">
                        <option value="FixedAmount">固定金額型 (單位數比例)</option>
                        <option value="FixedRatio">固定比例型 (現值比例)</option>
                      </select>
                  </div>
                  <InputGroup label="D: 配息率" name="D_divRate" value={tempConfig.D_divRate} onChange={handleConfigChange} suffix="%" />
                  <InputGroup label="E: 淨值變動率" name="E_navChange" value={tempConfig.E_navChange} onChange={handleConfigChange} suffix="%" step="0.1" />
                  <InputGroup label="F: 成長型報酬率" name="F_growth" value={tempConfig.F_growth} onChange={handleConfigChange} suffix="%" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b pb-1">Fees</h3>
                  <InputGroup label="G: 前H年管理費率" name="G_mgmtFee" value={tempConfig.G_mgmtFee} onChange={handleConfigChange} suffix="%" />
                  <InputGroup label="H: 高費用年期" name="H_years" value={tempConfig.H_years} onChange={handleConfigChange} suffix="年" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b pb-1">Cash Flow</h3>
                  <InputGroup label="RP: 配息滾入比例" name="RP_reinvestRate" value={tempConfig.RP_reinvestRate} onChange={handleConfigChange} suffix="%" />
                  <p className="text-xs text-slate-400 -mt-3 mb-2">*剩餘比例 {100 - tempConfig.RP_reinvestRate}% 為現金給付</p>
                  <div className="grid grid-cols-2 gap-4">
                      <InputGroup label="房貸 HL" name="HL_amount" value={tempConfig.HL_amount} onChange={handleConfigChange} suffix="萬/月" />
                      <InputGroup label="HL 年期" name="HL_years" value={tempConfig.HL_years} onChange={handleConfigChange} suffix="年" />
                      <div className="col-span-2 flex items-center mb-2">
                        <InputGroup label="HL 結束後轉入配息比例" name="Reinvest_HL_Rate" value={tempConfig.Reinvest_HL_Rate} onChange={handleConfigChange} suffix="%" />
                      </div>
                      <InputGroup label="週轉息 FLINT" name="FLINT_amount" value={tempConfig.FLINT_amount} onChange={handleConfigChange} suffix="萬/月" />
                      <InputGroup label="FLINT 年期" name="FLINT_years" value={tempConfig.FLINT_years} onChange={handleConfigChange} suffix="年" />
                      <div className="col-span-2 flex items-center mb-2">
                        <InputGroup label="FLINT 結束後轉入配息比例" name="Reinvest_FLINT_Rate" value={tempConfig.Reinvest_FLINT_Rate} onChange={handleConfigChange} suffix="%" />
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                      <InputGroup label="小水庫保單 PP" name="PP_policy" value={tempConfig.PP_policy} onChange={handleConfigChange} suffix="萬/月" step="0.00001" />
                      <InputGroup label="Q: 小水庫年期" name="Q_policyYears" value={tempConfig.Q_policyYears} onChange={handleConfigChange} suffix="年" />
                      <div className="col-span-2 flex items-center">
                        <InputGroup label="PP 結束後轉入配息比例" name="Reinvest_PP_Rate" value={tempConfig.Reinvest_PP_Rate} onChange={handleConfigChange} suffix="%" />
                      </div>
                  </div>
                </div>

                <div className="space-y-4 md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider border-b border-blue-200 pb-1 mb-3">Rebalance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="RY: 啟動移轉年" name="RY_startYear" value={tempConfig.RY_startYear} onChange={handleConfigChange} suffix="年" />
                    <InputGroup label="RG: 移轉比例 (GP -> MDP)" name="RG_rate" value={tempConfig.RG_rate} onChange={handleConfigChange} suffix="%" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center sticky bottom-0">
                <button 
                    onClick={fetchData} 
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 px-3 py-2 rounded-lg transition-colors text-xs font-medium mr-auto"
                    title="重新讀取 Google Sheet 設定"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  重新讀取雲端資料
                </button>
                <button onClick={resetConfig} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 px-4 py-2 rounded-lg transition-colors">
                  <RotateCcw className="h-4 w-4" />
                  重置預設
                </button>
                <button onClick={saveConfig} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-all transform hover:scale-105">
                  <Save className="h-4 w-4" />
                  儲存設定並重新計算
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Sub Components ---
function MetricCard({ title, value, icon, trend, subtext, isCurrency, highlightNegative }) {
  const isNegative = highlightNegative && value.includes("-");
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-28 relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-xs font-medium text-slate-500 line-clamp-2 leading-tight">{title}</h3>
        <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors shrink-0">
          {icon}
        </div>
      </div>
      <div>
        <div className={`text-xl font-bold tracking-tight font-mono tabular-nums ${isNegative ? 'text-red-600' : 'text-slate-900'}`}>
          {value}
        </div>
        {subtext && (
          <p className="text-[10px] text-slate-400 mt-0.5 font-mono truncate">{subtext}</p>
        )}
      </div>
      {trend && (
        <div className={`absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full ${trend === 'up' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
      )}
    </div>
  );
}

function InputGroup({ label, name, value, onChange, suffix, step = "1", type = "number" }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value ?? ''} 
          onChange={onChange}
          step={step}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
        />
        {suffix && (
          <span className="absolute right-3 top-2 text-sm text-slate-400 pointer-events-none">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function ColorInputGroup({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          name={name}
          value={value}
          onChange={onChange}
          className="h-8 w-8 rounded cursor-pointer border border-slate-300 p-0.5"
        />
        <input 
            type="text" 
            name={name}
            value={value}
            onChange={onChange}
            className="w-20 border border-slate-300 rounded-md px-2 py-1 text-sm font-mono uppercase text-slate-600"
        />
      </div>
    </div>
  );
}
