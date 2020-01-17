-- NOTE that this must be tested with private mode

-- redeploy target

function legacy()
  return "legacy"
end

abi.register_view(legacy)
