export class ActionList {
    id: number;
    Name: string;
    Owner: string;
    Duedate: string;
    Priority: string;
    Status: string;
    isCheccked:boolean;
    isExpanded:boolean;
    desp_cntnt:boolean;
    cmnts_cntnt:boolean;
    expand_section_cmnt:boolean;
  }

  export class CommentList {
    id: number;
    name: string;
    date: string;
    text: string;
  }

  export class OptionList {
    name: string;
    isselected: boolean;
  }