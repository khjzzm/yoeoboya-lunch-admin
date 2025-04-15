import { Select, Space } from "antd";
import { useState } from "react";

import { SearchFilterOption } from "@/types";

import Btn from "@/components/common/Btn";

import CheckboxFilterField from "./fields/CheckboxFilterField";
import RadioFilterField from "./fields/RadioFilterField";
import TextFilterField from "./fields/TextFilterField";

interface FilterProps {
  onSearch: (filters: { [key: string]: string | string[] }) => void;
  filterOptions: SearchFilterOption[];
}

export default function SearchFilters({ onSearch, filterOptions }: FilterProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>(filterOptions[0]?.value || "");
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCheckboxValues, setSelectedCheckboxValues] = useState<string[]>([]);
  const [selectedRadioValue, setSelectedRadioValue] = useState<string>("");

  const currentFilter = filterOptions.find((f) => f.value === selectedFilter);

  const handleSearch = () => {
    if (currentFilter?.inputType === "checkbox") {
      onSearch({ [selectedFilter]: selectedCheckboxValues });
    } else if (currentFilter?.inputType === "radio") {
      onSearch({ [selectedFilter]: selectedRadioValue });
    } else {
      onSearch({ [selectedFilter]: searchValue });
    }
  };

  const renderInputField = () => {
    switch (currentFilter?.inputType) {
      case "checkbox":
        return (
          <CheckboxFilterField
            options={currentFilter.options || []}
            value={selectedCheckboxValues}
            onChange={setSelectedCheckboxValues}
          />
        );
      case "radio":
        return (
          <RadioFilterField
            options={currentFilter.options || []}
            value={selectedRadioValue}
            onChange={setSelectedRadioValue}
          />
        );
      case "text":
      default:
        return (
          <TextFilterField value={searchValue} onChange={setSearchValue} onEnter={handleSearch} />
        );
    }
  };

  const resetInputValues = () => {
    setSearchValue("");
    setSelectedCheckboxValues([]);
    setSelectedRadioValue("");
  };

  return (
    <Space direction="vertical" style={{ marginBottom: 16, display: "flex", gap: 8 }}>
      <Space style={{ display: "flex", gap: 8 }}>
        <Select
          value={selectedFilter}
          options={filterOptions.map(({ label, value }) => ({ label, value }))}
          onChange={(value) => {
            setSelectedFilter(value);
            resetInputValues();
          }}
          style={{ minWidth: 120 }}
        />
        {renderInputField()}
        <Btn text={"검색"} onClick={handleSearch} />
      </Space>
    </Space>
  );
}
