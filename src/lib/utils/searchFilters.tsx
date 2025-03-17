import { useState } from "react";
import { Space, Input, Button, Select, Checkbox } from "antd";

interface FilterProps {
  onSearch: (filters: { [key: string]: string | string[] }) => void;
  filterOptions: { label: string; value: string }[];
}


const roleOptions = [
  { label: "어드민", value: "ROLE_ADMIN" },
  { label: "매니저", value: "ROLE_MANAGER" },
  { label: "유저", value: "ROLE_USER" },
  { label: "게스트", value: "ROLE_GUEST" },
  { label: "차단", value: "ROLE_BLOCK" },
];

export default function SearchFilters({ onSearch, filterOptions }: FilterProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>(filterOptions[0]?.value || "");
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // 체크박스 변경 핸들러
  const handleRoleChange = (checkedValues: string[]) => {
    setSelectedRoles(checkedValues);
  };

  const handleSearch = () => {
    if (selectedFilter === "authority") {
      onSearch({ authority: selectedRoles });
    } else {
      onSearch({ [selectedFilter]: searchValue });
    }
  };

  return (
    <Space direction="vertical" style={{ marginBottom: 16, display: "flex", gap: 8 }}>
      <Space style={{ display: "flex", gap: 8 }}>
        <Select
          value={selectedFilter}
          options={filterOptions}
          onChange={(value) => {
            setSelectedFilter(value);
            setSearchValue("");
            setSelectedRoles([]); // ✅ 필터 변경 시 역할 선택 초기화
          }}
          style={{ minWidth: 120 }}
        />
        {selectedFilter === "authority" ? (
          <Checkbox.Group
            options={roleOptions}
            value={selectedRoles}
            onChange={(checkedValues) => handleRoleChange(checkedValues as string[])}
          />
        ) : (
          <Input
            placeholder="검색어 입력"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            allowClear
            style={{ flex: "1" }}
          />
        )}
        <Button type="primary" onClick={handleSearch}>검색</Button>
      </Space>
    </Space>
  );
}