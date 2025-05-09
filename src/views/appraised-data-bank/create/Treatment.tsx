"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Swal from "sweetalert2";
import { useSearchParams, useRouter } from "next/navigation";

const Treatment = () => {
  const [medicineList, setMedicineList] = useState([]);
  const [eyeDrops, setEyeDrops] = useState([{ medicine: "", dosage: "", doseDuration: "", time: "", doseInterval: "", comment: "" }]);
  const [tablets, setTablets] = useState([{ medicine: "", dosage: "", doseDuration: "", time: "", doseInterval: "", comment: "" }]);
  const [ointments, setOintments] = useState([{ medicine: "", dosage: "", doseDuration: "", time: "", doseInterval: "", comment: "" }]);
  const [prescriptionGlasses, setPrescriptionGlasses] = useState([{ frame: "", lensType: "", costOfLens: "", costOfFrame: "" }]);
  const [loading, setLoading] = useState(false);

  const doseDurationOptions = ["1 Week", "2 Weeks", "1 Month", "3 Months"];
  const timeOptions = ["Morning", "Afternoon", "Evening", "Night"];
  const doseIntervals = ["Before Meal", "After Meal"];

  useEffect(() => {
    const fetchMedicineList = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/medicines`);
        setMedicineList(response.data);
      } catch (error) {
        Swal.fire({ icon: "error", title: "Error", text: "Failed to fetch medicine list." });
      }
    };
    fetchMedicineList();
  }, []);

  const handleAddRow = (setter) => {
    setter((prev) => [...prev, {}]);
  };

  const handleRemoveRow = (index, state, setter) => {
    setter(state.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value, state, setter) => {
    const updatedRows = [...state];
    updatedRows[index][field] = value;
    setter(updatedRows);
  };

  const searchParams = useSearchParams();
  const router = useRouter();
  const patientId = searchParams.get("patientId");
  const patientName = searchParams.get("patientName");
  const encounterId = searchParams.get("encounterId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Ensure that empty arrays are set to null and empty strings are sent as null or empty strings
    const normalizeData = (data) => {
      return data.map(item => {
        const normalizedItem = {};
        for (const [key, value] of Object.entries(item)) {
          normalizedItem[key] = value || null; // Replace empty values with null
        }
        return normalizedItem;
      });
    };
  
    const payload = {
      eyeDrops: normalizeData(eyeDrops),
      tablets: normalizeData(tablets),
      ointments: normalizeData(ointments),
      prescriptionGlasses: normalizeData(prescriptionGlasses),
      patientId: patientId || null, // Make sure patientId is not undefined
      encounterId: encounterId || null, // Ensure encounterId is also null if empty
    };
  
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/treatment`, payload);
      Swal.fire({ icon: "success", title: "Success", text: "Data submitted successfully!", timer: 3000, showConfirmButton: false });
      router.push(
        `/dashboard/appointments/encounter-appointment?patientId=${patientId}&patientName=${patientName}&encounterId=${encounterId}`
      );
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "An error occurred while submitting data." });
    } finally {
      setLoading(false);
    }
  };
  

  const renderTable = (title, rows, setter, fields) => (
    <div>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {rows.map((row, index) => (
          <Grid container spacing={2} key={index}>
            {fields.map((field) => (
              <Grid item xs={3} key={field.name}>
                {field.type === "select" ? (
                  <FormControl fullWidth>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      value={row[field.name] || ""}
                      onChange={(e) => handleInputChange(index, field.name, e.target.value, rows, setter)}
                    >
                      {(field.options || []).map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  // <TextField
                  //   label={field.label}
                  //   value={row[field.name] || ""}
                  //   onChange={(e) => handleInputChange(index, field.name, e.target.value, rows, setter)}
                  //   fullWidth
                  // />
                  <TextField
    label={field.label}
    value={row[field.name] || ""}
    onChange={(e) => handleInputChange(index, field.name, e.target.value, rows, setter)}
    type={field.type === "number" ? "number" : "text"}
    fullWidth
/>

                )}
              </Grid>
            ))}
            <Grid item xs={1}>
              <IconButton onClick={() => handleRemoveRow(index, rows, setter)} color="error">
                <RemoveCircleIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="secondary" onClick={() => handleAddRow(setter)} className="mt-2">
        Add More
      </Button>
    </div>
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Treatment
        </Typography>
        <form onSubmit={handleSubmit}>
          {renderTable("Eye Drops", eyeDrops, setEyeDrops, [
            { name: "medicine", label: "Medicine" },
            { name: "dosage", label: "Dosage" },
            { name: "doseDuration", label: "Dosage Duration", type: "select", options: doseDurationOptions },
            { name: "time", label: "Time", type: "select", options: timeOptions },
            { name: "doseInterval", label: "Dose Interval", type: "select", options: doseIntervals },
            { name: "comment", label: "Comment" },
          ])}
          {renderTable("Tablets", tablets, setTablets, [
            { name: "medicine", label: "Medicine" },
            { name: "dosage", label: "Dosage" },
            { name: "doseDuration", label: "Dosage Duration", type: "select", options: doseDurationOptions },
            { name: "time", label: "Time", type: "select", options: timeOptions },
            { name: "doseInterval", label: "Dose Interval", type: "select", options: doseIntervals },
            { name: "comment", label: "Comment" },
          ])}
          {renderTable("Ointments", ointments, setOintments, [
            { name: "medicine", label: "Medicine" },
            { name: "dosage", label: "Dosage" },
            { name: "doseDuration", label: "Dosage Duration", type: "select", options: doseDurationOptions },
            { name: "time", label: "Time", type: "select", options: timeOptions },
            { name: "doseInterval", label: "Dose Interval", type: "select", options: doseIntervals },
            { name: "comment", label: "Comment" },
          ])}
          {renderTable("Prescription Glasses", prescriptionGlasses, setPrescriptionGlasses, [
            { name: "frame", label: "Frame" },
            { name: "lensType", label: "Lens Type" },
            { name: "costOfLens", label: "Cost of Lens", type: "number" },
            { name: "costOfFrame", label: "Cost of Frame", type: "number" },
          ])}
          <Button variant="contained" color="primary" type="submit" disabled={loading} startIcon={loading && <CircularProgress size={20} />} className="mt-4">
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Treatment;
